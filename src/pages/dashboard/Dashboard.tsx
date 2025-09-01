import React, { useState, useEffect } from 'react';
import FilterBar from '../../components/filters/filter-bar/FilterBar';
import DataTable from '../../components/data-table/DataTable';
import UsageChart from '../../components/charts/UsageChart';
import LineChart from '../../components/charts/LineChart';
import StatCard from '../../components/cards/StatCard';
import PeriodSelector from '../../components/period-selector/PeriodSelector';

import type { SummaryMetric } from '../../services/models/SummaryMetric';
import type { Filters } from '../../services/models/Filters';

import { usageMetricsWebservice } from '../../services/UsageMetricsWebservice';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [filteredData, setFilteredData] = useState<SummaryMetric[]>([]);
  const [allData, setAllData] = useState<SummaryMetric[]>([]);
  const [costSeries, setCostSeries] = useState<{ name: string; data: number[]; color: string }[]>([]);
  const [revenueSeries, setRevenueSeries] = useState<{ name: string; data: number[]; color: string }[]>([]);
  const [usageSeries, setUsageSeries] = useState<{ name: string; data: number[]; color: string }[]>([]);

  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const chartsColorPalette = [
    '#3b82f6',
    '#f97316',
    '#10b981',
    '#6366f1',
    '#f43f5e',
    '#fbbf24',
    '#8b5cf6',
    '#22c55e',
    '#ec4899',
  ];

  const [vendorSeries, setVendorSeries] = useState<{ label: string; data: number[]; color: string }[]>([]);
  const [modelSeries, setModelSeries] = useState<{ label: string; data: number[]; color: string }[]>([]);
  const [apiTypeSeries, setApiTypeSeries] = useState<{ label: string; data: number[]; color: string }[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    fetchAllMetrics();
    handleFilterChange({});
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchAllMetrics = async () => {
    try {
      const response = await usageMetricsWebservice.getSummaryMetrics({});
      const metrics = response.data;
      setAllData(metrics);

      // Group by day for line chart
      const dailySummary: { [date: string]: { cost: number; revenue: number; profit: number; usage: number } } = {};

      metrics.forEach(m => {
        const date = new Date(m.timestamp).toISOString().split('T')[0];
        if (!dailySummary[date]) dailySummary[date] = { cost: 0, revenue: 0, profit: 0, usage: 0 };
        dailySummary[date].cost += m.totalCost ?? 0;
        dailySummary[date].revenue += m.totalRevenue ?? 0;
        dailySummary[date].profit += m.totalProfit ?? 0;
        dailySummary[date].usage += m.totalUsage ?? 0;
      });

      const labels = Object.keys(dailySummary);

      // setChartLabels(labels);
      setCostSeries([{ name: 'Cost', data: labels.map(d => dailySummary[d].cost), color: '#f59e0b' }]);
      setRevenueSeries([{ name: 'Revenue', data: labels.map(d => dailySummary[d].revenue), color: '#3b82f6' }]);
      setUsageSeries([{ name: 'Usage', data: labels.map(d => dailySummary[d].usage), color: '#10b981' }]);
    } catch (err) {
      console.error("Failed to fetch all metrics for totals", err);
    }
  };

  const handleFilterChange = async (filters: Filters) => {
    try {
      const response = await usageMetricsWebservice.getSummaryMetrics(filters);
      setFilteredData(response.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  function getColor(index: number) {
    return chartsColorPalette[index % chartsColorPalette.length];
  }

  const fetchChartData = async () => {
    try {
      const [vendorResponse, modelResponse, apiTypeResponse] = await Promise.all([
        usageMetricsWebservice.getGroupedMetrics('vendorName', period),
        usageMetricsWebservice.getGroupedMetrics('vendorModel', period),
        usageMetricsWebservice.getGroupedMetrics('vendorApiType', period),
      ]);

      const vendorData = vendorResponse.data;
      const modelData = modelResponse.data;
      const apiTypeData = apiTypeResponse.data;

      // Collect all unique dates across all data
      const allDates = new Set<string>();
      const collectDates = (dataObj: Record<string, { period: string; value: number }[]>) => {
        Object.values(dataObj).forEach(series =>
          series.forEach(pv => allDates.add(pv.period))
        );
      };

      collectDates(vendorData);
      collectDates(modelData);
      collectDates(apiTypeData);

      const labels = Array.from(allDates).sort(); // keep sorted for chart consistency

      // Helper to fill missing dates with 0
      const buildSeries = (
        dataObj: Record<string, { period: string; value: number }[]>
      ) => {
        return Object.keys(dataObj).map((key, i) => {
          const dataMap = new Map(dataObj[key].map(pv => [pv.period, pv.value]));
          return {
            label: key,
            data: labels.map(date => dataMap.get(date) ?? 0),
            color: getColor(i),
          };
        });
      };

      // Build all series
      const vendorSeries = buildSeries(vendorData);
      const modelSeries = buildSeries(modelData);
      const apiTypeSeries = buildSeries(apiTypeData);

      // Update states
      setChartLabels(labels);
      setVendorSeries(vendorSeries);
      setModelSeries(modelSeries);
      setApiTypeSeries(apiTypeSeries);

    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  };



  // Calculate totals from allData
  const totalUsage = Number(allData.reduce((sum, item) => sum + (item.totalUsage ?? 0), 0).toFixed(2));
  const totalRevenue = Number(allData.reduce((sum, item) => sum + (item.totalRevenue ?? 0), 0).toFixed(2));
  const totalProfit = Number(allData.reduce((sum, item) => sum + (item.totalProfit ?? 0), 0).toFixed(2));
  const totalCost = Number(allData.reduce((sum, item) => sum + (item.totalCost ?? 0), 0).toFixed(2));

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">LLM Usage Tracker</h1>
      <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
        <StatCard title="Total Usage" value={`${totalUsage}`} bgColor="#F06422" textColor="#ffffff" />
        <StatCard title="Total Revenue" value={`$${totalRevenue}`} bgColor="#3b82f6" textColor="#ffffff" />
        <StatCard title="Total Cost" value={`$${totalCost}`} bgColor="#ef4444" textColor="#ffffff" />
        <StatCard title="Total Profit" value={`$${totalProfit}`} bgColor="#10b981" textColor="#ffffff" />
      </div>
      <PeriodSelector period={period} onChange={setPeriod} />
      <div className="charts-container" style={{display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap"}}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <UsageChart labels={chartLabels} series={vendorSeries} title="Usage per Vendor" />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <UsageChart labels={chartLabels} series={modelSeries} title="Usage per Model" />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <UsageChart labels={chartLabels} series={apiTypeSeries} title="Usage per API Type" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <LineChart labels={chartLabels} series={costSeries} title="Cost Trend" />
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <LineChart labels={chartLabels} series={revenueSeries} title="Revenue Trend" />
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <LineChart labels={chartLabels} series={usageSeries} title="Usage Trend" />
        </div>
      </div>
      <FilterBar onFilterChange={handleFilterChange} />
      <DataTable data={filteredData} />
    </div>
  );
};

export default Dashboard;
