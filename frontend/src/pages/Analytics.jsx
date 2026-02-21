import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/* ══════════════════════════════════════════
   DATA
   ══════════════════════════════════════════ */

/* ── Fuel efficiency: 2 lines (Truck fleet avg vs Van fleet avg) over 12 months ── */
const FUEL_EFFICIENCY = [
  { month: 'Mar', truck: 4.2, van: 8.1, bike: 35.2 },
  { month: 'Apr', truck: 4.0, van: 7.9, bike: 34.5 },
  { month: 'May', truck: 4.3, van: 8.3, bike: 36.1 },
  { month: 'Jun', truck: 3.9, van: 7.6, bike: 33.8 },
  { month: 'Jul', truck: 4.1, van: 8.0, bike: 34.9 },
  { month: 'Aug', truck: 4.4, van: 8.5, bike: 36.5 },
  { month: 'Sep', truck: 4.2, van: 8.2, bike: 35.7 },
  { month: 'Oct', truck: 4.5, van: 8.7, bike: 37.2 },
  { month: 'Nov', truck: 4.3, van: 8.4, bike: 36.0 },
  { month: 'Dec', truck: 4.0, van: 7.8, bike: 34.2 },
  { month: 'Jan', truck: 4.6, van: 8.9, bike: 37.8 },
  { month: 'Feb', truck: 4.4, van: 8.6, bike: 36.8 },
];

/* ── Top 5 costliest vehicles ── */
const COSTLIEST_VEHICLES = [
  { vehicle: 'Kenworth T680', cost: 45000 },
  { vehicle: 'MAN TGX', cost: 38500 },
  { vehicle: 'Peterbilt 579', cost: 32000 },
  { vehicle: 'Mercedes Actros', cost: 28700 },
  { vehicle: 'Scania R500', cost: 24200 },
];

/* ── India city bookings heatmap data ── */
const CITY_BOOKINGS = [
  { city: 'Mumbai', lat: 19.076, lng: 72.8777, bookings: 48 },
  { city: 'Delhi', lat: 28.7041, lng: 77.1025, bookings: 52 },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946, bookings: 38 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, bookings: 29 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, bookings: 25 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867, bookings: 33 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, bookings: 22 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, bookings: 27 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873, bookings: 18 },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462, bookings: 15 },
  { city: 'Surat', lat: 21.1702, lng: 72.8311, bookings: 14 },
  { city: 'Kanpur', lat: 26.4499, lng: 80.3319, bookings: 10 },
  { city: 'Nagpur', lat: 21.1458, lng: 79.0882, bookings: 12 },
  { city: 'Indore', lat: 22.7196, lng: 75.8577, bookings: 16 },
  { city: 'Patna', lat: 25.6093, lng: 85.1376, bookings: 9 },
  { city: 'Bhopal', lat: 23.2599, lng: 77.4126, bookings: 11 },
  { city: 'Coimbatore', lat: 11.0168, lng: 76.9558, bookings: 13 },
  { city: 'Kochi', lat: 9.9312, lng: 76.2673, bookings: 17 },
  { city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, bookings: 8 },
  { city: 'Chandigarh', lat: 30.7333, lng: 76.7794, bookings: 7 },
  { city: 'Guwahati', lat: 26.1445, lng: 91.7362, bookings: 5 },
  { city: 'Ranchi', lat: 23.3441, lng: 85.3096, bookings: 6 },
  { city: 'Vadodara', lat: 22.3072, lng: 73.1812, bookings: 10 },
  { city: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, bookings: 11 },
  { city: 'Amritsar', lat: 31.634, lng: 74.8723, bookings: 8 },
];

/* ── India states GeoJSON URL (public source) ── */
const INDIA_STATES_GEOJSON_URL =
  'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson';

/* ── Daily profit data for Feb 2026 ── */
const DAILY_PROFIT = Array.from({ length: 21 }, (_, i) => ({
  day: i + 1,
  profit: Math.round(15000 + Math.random() * 35000 - (Math.random() > 0.75 ? 20000 : 0)),
}));

/* ── Financial summary ── */
const FINANCIAL_SUMMARY = [
  { month: 'Sep 2025', revenue: 485000, fuelCost: 142000, maintenance: 38000, netProfit: 305000 },
  { month: 'Oct 2025', revenue: 520000, fuelCost: 155000, maintenance: 45000, netProfit: 320000 },
  { month: 'Nov 2025', revenue: 498000, fuelCost: 148000, maintenance: 52000, netProfit: 298000 },
  { month: 'Dec 2025', revenue: 560000, fuelCost: 168000, maintenance: 35000, netProfit: 357000 },
  { month: 'Jan 2026', revenue: 535000, fuelCost: 160000, maintenance: 62000, netProfit: 313000 },
  { month: 'Feb 2026', revenue: 510000, fuelCost: 152000, maintenance: 48000, netProfit: 310000 },
];

/* ══════════════════════════════════════════
   CHART COMPONENTS
   ══════════════════════════════════════════ */

const CHART_COLORS = {
  accent: '#EAEFEF',
  muted: '#BFC9D1',
  primary: '#25343F',
  secondary: '#FF9B51',
  line1: '#60a5fa',   // blue  (truck)
  line2: '#34d399',   // green (van)
  line3: '#fb923c',   // orange (bike)
  bar: '#818cf8',     // indigo
  profitPos: '#34d399',
  profitNeg: '#f87171',
  heatLow: '#FF9B51',
  heatHigh: '#f87171',
};

/* ── 1. Fuel Efficiency Line Chart ── */
function FuelEfficiencyChart() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(FUEL_EFFICIENCY.map((d) => d.month)).range([0, w]).padding(0.5);
    const y = d3.scaleLinear().domain([3, 40]).range([h, 0]);

    // Grid
    g.append('g').attr('class', 'grid')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', CHART_COLORS.secondary).attr('stroke-opacity', 0.2);

    // X axis
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '11px');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat((d) => `${d} km/L`))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '11px');

    // Truck line
    const truckLine = d3.line().x((d) => x(d.month)).y((d) => y(d.truck)).curve(d3.curveMonotoneX);
    g.append('path').datum(FUEL_EFFICIENCY)
      .attr('fill', 'none').attr('stroke', CHART_COLORS.line1)
      .attr('stroke-width', 2.5).attr('d', truckLine);
    g.selectAll('.dot-truck').data(FUEL_EFFICIENCY).join('circle')
      .attr('cx', (d) => x(d.month)).attr('cy', (d) => y(d.truck))
      .attr('r', 4).attr('fill', CHART_COLORS.line1).attr('stroke', CHART_COLORS.primary).attr('stroke-width', 2);

    // Van line
    const vanLine = d3.line().x((d) => x(d.month)).y((d) => y(d.van)).curve(d3.curveMonotoneX);
    g.append('path').datum(FUEL_EFFICIENCY)
      .attr('fill', 'none').attr('stroke', CHART_COLORS.line2)
      .attr('stroke-width', 2.5).attr('d', vanLine);
    g.selectAll('.dot-van').data(FUEL_EFFICIENCY).join('circle')
      .attr('cx', (d) => x(d.month)).attr('cy', (d) => y(d.van))
      .attr('r', 4).attr('fill', CHART_COLORS.line2).attr('stroke', CHART_COLORS.primary).attr('stroke-width', 2);

    // Bike line
    const bikeLine = d3.line().x((d) => x(d.month)).y((d) => y(d.bike)).curve(d3.curveMonotoneX);
    g.append('path').datum(FUEL_EFFICIENCY)
      .attr('fill', 'none').attr('stroke', CHART_COLORS.line3)
      .attr('stroke-width', 2.5).attr('d', bikeLine);
    g.selectAll('.dot-bike').data(FUEL_EFFICIENCY).join('circle')
      .attr('cx', (d) => x(d.month)).attr('cy', (d) => y(d.bike))
      .attr('r', 4).attr('fill', CHART_COLORS.line3).attr('stroke', CHART_COLORS.primary).attr('stroke-width', 2);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 10}, 12)`);
    [{ label: 'Truck Fleet', color: CHART_COLORS.line1 }, { label: 'Van Fleet', color: CHART_COLORS.line2 }, { label: 'Bike Fleet', color: CHART_COLORS.line3 }].forEach((item, i) => {
      const lg = legend.append('g').attr('transform', `translate(${i * 120}, 0)`);
      lg.append('circle').attr('r', 5).attr('fill', item.color);
      lg.append('text').attr('x', 12).attr('y', 4).text(item.label)
        .attr('fill', CHART_COLORS.accent).attr('font-size', '11px');
    });
  }, []);

  return <svg ref={svgRef} className="w-full" />;
}

/* ── 2. Top 5 Costliest Vehicles Bar Chart ── */
function CostliestVehiclesChart() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(COSTLIEST_VEHICLES.map((d) => d.vehicle)).range([0, w]).padding(0.35);
    const y = d3.scaleLinear().domain([0, 50000]).range([h, 0]);

    // Grid
    g.append('g').selectAll('line').data(y.ticks(5)).join('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', CHART_COLORS.secondary).attr('stroke-opacity', 0.2);

    // Bars
    g.selectAll('rect').data(COSTLIEST_VEHICLES).join('rect')
      .attr('x', (d) => x(d.vehicle)).attr('y', (d) => y(d.cost))
      .attr('width', x.bandwidth()).attr('height', (d) => h - y(d.cost))
      .attr('fill', CHART_COLORS.bar).attr('rx', 4).attr('opacity', 0.85);

    // Bar labels
    g.selectAll('.bar-label').data(COSTLIEST_VEHICLES).join('text')
      .attr('x', (d) => x(d.vehicle) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.cost) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', CHART_COLORS.accent).attr('font-size', '11px').attr('font-weight', '600')
      .text((d) => `₹${(d.cost / 1000).toFixed(1)}K`);

    // X axis
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '10px')
      .attr('transform', 'rotate(-20)').attr('text-anchor', 'end');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat((d) => `₹${d / 1000}K`))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '11px');
  }, []);

  return <svg ref={svgRef} className="w-full" />;
}

/* ── 3. India Booking Heatmap (Interactive with State Boundaries) ── */
function IndiaHeatmap() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = 500;

    svg.attr('width', width).attr('height', height)
      .style('cursor', 'grab');

    // Tooltip div
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('background', '#3a4a3c')
      .style('border', `1px solid ${CHART_COLORS.secondary}`)
      .style('border-radius', '10px')
      .style('padding', '10px 14px')
      .style('font-size', '12px')
      .style('color', CHART_COLORS.accent)
      .style('box-shadow', '0 8px 24px rgba(0,0,0,0.4)')
      .style('z-index', '100')
      .style('backdrop-filter', 'blur(8px)');

    // Projection centered on India
    const projection = d3.geoMercator()
      .center([82, 22])
      .scale(Math.min(width, height) * 1.6)
      .translate([width / 2, height / 2]);

    const pathGen = d3.geoPath().projection(projection);

    // Defs (filters, gradients)
    const defs = svg.append('defs');

    // Radial glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic']).join('feMergeNode')
      .attr('in', (d) => d);

    // Zoom & pan
    const mapGroup = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([1, 6])
      .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform);
        svg.style('cursor', event.transform.k > 1 ? 'grabbing' : 'grab');
      });
    svg.call(zoom);

    // Fetch India states GeoJSON and render
    d3.json(INDIA_STATES_GEOJSON_URL).then((geoData) => {
      setLoading(false);

      // ── Draw state polygons ──
      mapGroup.selectAll('.state')
        .data(geoData.features)
        .join('path')
        .attr('class', 'state')
        .attr('d', pathGen)
        .attr('fill', CHART_COLORS.secondary)
        .attr('fill-opacity', 0.10)
        .attr('stroke', CHART_COLORS.secondary)
        .attr('stroke-opacity', 0.55)
        .attr('stroke-width', 0.8)
        .on('mouseenter', function (event, d) {
          d3.select(this)
            .transition().duration(150)
            .attr('fill-opacity', 0.22)
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', 1.4);

          const stateName = d.properties.ST_NM || d.properties.NAME_1 || d.properties.name || 'Unknown';
          tooltip
            .html(`<div style="font-weight:700;font-size:13px">${stateName}</div>`)
            .transition().duration(150)
            .style('opacity', 1);
        })
        .on('mousemove', function (event) {
          const containerRect = svgRef.current.parentElement.getBoundingClientRect();
          tooltip
            .style('left', `${event.clientX - containerRect.left + 14}px`)
            .style('top', `${event.clientY - containerRect.top - 10}px`);
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition().duration(250)
            .attr('fill-opacity', 0.10)
            .attr('stroke-opacity', 0.55)
            .attr('stroke-width', 0.8);
          tooltip.transition().duration(150).style('opacity', 0);
        });

      // ── City booking bubbles (on top of states) ──
      const maxBookings = d3.max(CITY_BOOKINGS, (d) => d.bookings);
      const colorScale = d3.scaleLinear().domain([0, maxBookings]).range([CHART_COLORS.heatLow, CHART_COLORS.heatHigh]);
      const sizeScale = d3.scaleSqrt().domain([0, maxBookings]).range([5, 24]);

      const bubbles = mapGroup.selectAll('.bubble')
        .data(CITY_BOOKINGS)
        .join('g')
        .attr('class', 'bubble')
        .attr('transform', (d) => {
          const [x, y] = projection([d.lng, d.lat]);
          return `translate(${x},${y})`;
        })
        .style('cursor', 'pointer');

      // Outer glow ring
      bubbles.append('circle')
        .attr('class', 'glow-ring')
        .attr('r', (d) => sizeScale(d.bookings) + 6)
        .attr('fill', (d) => colorScale(d.bookings))
        .attr('opacity', 0.15)
        .attr('filter', 'url(#glow)');

      // Main bubble
      bubbles.append('circle')
        .attr('class', 'main-dot')
        .attr('r', (d) => sizeScale(d.bookings))
        .attr('fill', (d) => colorScale(d.bookings))
        .attr('opacity', 0.8)
        .attr('stroke', CHART_COLORS.accent)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3)
        .style('transition', 'opacity 0.2s, r 0.2s');

      // Inner bright dot
      bubbles.append('circle')
        .attr('r', 2.5)
        .attr('fill', CHART_COLORS.accent)
        .attr('opacity', 0.6);

      // City labels for top bookings
      bubbles.filter((d) => d.bookings >= 25)
        .append('text')
        .attr('dy', (d) => -sizeScale(d.bookings) - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', CHART_COLORS.accent)
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('opacity', 0.9)
        .text((d) => d.city);

      // Hover interactions on bubbles
      bubbles
        .on('mouseenter', function (event, d) {
          const el = d3.select(this);
          el.select('.main-dot')
            .transition().duration(200)
            .attr('r', sizeScale(d.bookings) + 4)
            .attr('opacity', 1)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8);
          el.select('.glow-ring')
            .transition().duration(200)
            .attr('r', sizeScale(d.bookings) + 12)
            .attr('opacity', 0.3);

          const pct = ((d.bookings / maxBookings) * 100).toFixed(0);
          tooltip
            .html(`
              <div style="font-weight:700;font-size:13px;margin-bottom:4px">${d.city}</div>
              <div style="display:flex;justify-content:space-between;gap:16px">
                <span style="color:${CHART_COLORS.muted}">Bookings</span>
                <span style="font-weight:600">${d.bookings}</span>
              </div>
              <div style="display:flex;justify-content:space-between;gap:16px">
                <span style="color:${CHART_COLORS.muted}">Share</span>
                <span style="font-weight:600">${pct}%</span>
              </div>
              <div style="margin-top:6px;height:4px;border-radius:2px;background:${CHART_COLORS.secondary}">
                <div style="height:100%;width:${pct}%;border-radius:2px;background:${colorScale(d.bookings)}"></div>
              </div>
            `)
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mousemove', function (event) {
          const containerRect = svgRef.current.parentElement.getBoundingClientRect();
          tooltip
            .style('left', `${event.clientX - containerRect.left + 14}px`)
            .style('top', `${event.clientY - containerRect.top - 10}px`);
        })
        .on('mouseleave', function (event, d) {
          const el = d3.select(this);
          el.select('.main-dot')
            .transition().duration(300)
            .attr('r', sizeScale(d.bookings))
            .attr('opacity', 0.8)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.3);
          el.select('.glow-ring')
            .transition().duration(300)
            .attr('r', sizeScale(d.bookings) + 6)
            .attr('opacity', 0.15);
          tooltip.transition().duration(200).style('opacity', 0);
        });

      // Legend
      const legendG = svg.append('g').attr('transform', `translate(${width - 140}, 16)`);
      legendG.append('rect').attr('x', -10).attr('y', -8).attr('width', 130).attr('height', 60).attr('rx', 8)
        .attr('fill', CHART_COLORS.primary).attr('opacity', 0.7);
      legendG.append('text').attr('fill', CHART_COLORS.accent).attr('font-size', '11px').attr('font-weight', '600').text('Bookings');
      const gradient = defs.append('linearGradient').attr('id', 'heat-gradient');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', CHART_COLORS.heatLow);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', CHART_COLORS.heatHigh);
      legendG.append('rect').attr('y', 12).attr('width', 90).attr('height', 10).attr('rx', 3).attr('fill', 'url(#heat-gradient)');
      legendG.append('text').attr('y', 36).attr('fill', CHART_COLORS.muted).attr('font-size', '9px').text('Low');
      legendG.append('text').attr('x', 90).attr('y', 36).attr('text-anchor', 'end').attr('fill', CHART_COLORS.muted).attr('font-size', '9px').text('High');
    }).catch(() => {
      setLoading(false);
      // Fallback: simple text if GeoJSON fails
      mapGroup.append('text')
        .attr('x', width / 2).attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', CHART_COLORS.muted).attr('font-size', '14px')
        .text('Could not load India map data');
    });

    // Zoom hint
    svg.append('text')
      .attr('x', 14).attr('y', height - 10)
      .attr('fill', CHART_COLORS.muted).attr('font-size', '10px').attr('opacity', 0.6)
      .text('Scroll to zoom · Drag to pan');
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-muted text-sm animate-pulse">Loading map data…</span>
        </div>
      )}
      <svg ref={svgRef} className="w-full" />
      <div ref={tooltipRef} />
    </div>
  );
}

/* ── 4. Daily Profit Chart ── */
function DailyProfitChart() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = 280;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(DAILY_PROFIT.map((d) => d.day)).range([0, w]).padding(0.2);
    const yMax = d3.max(DAILY_PROFIT, (d) => Math.abs(d.profit));
    const y = d3.scaleLinear().domain([-5000, yMax + 5000]).range([h, 0]);

    // Grid
    g.append('g').selectAll('line').data(y.ticks(6)).join('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', CHART_COLORS.secondary).attr('stroke-opacity', 0.15);

    // Zero line
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', CHART_COLORS.muted).attr('stroke-opacity', 0.4).attr('stroke-dasharray', '4,3');

    // Bars
    g.selectAll('rect').data(DAILY_PROFIT).join('rect')
      .attr('x', (d) => x(d.day))
      .attr('y', (d) => d.profit >= 0 ? y(d.profit) : y(0))
      .attr('width', x.bandwidth())
      .attr('height', (d) => Math.abs(y(0) - y(d.profit)))
      .attr('fill', (d) => d.profit >= 0 ? CHART_COLORS.profitPos : CHART_COLORS.profitNeg)
      .attr('rx', 2).attr('opacity', 0.8);

    // X axis
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues(DAILY_PROFIT.filter((_, i) => i % 3 === 0).map((d) => d.day)))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '10px');

    // X label
    g.append('text')
      .attr('x', w / 2).attr('y', h + 35)
      .attr('text-anchor', 'middle').attr('fill', CHART_COLORS.muted).attr('font-size', '11px')
      .text('Day of Month (Feb 2026)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(0).tickFormat((d) => `₹${d / 1000}K`))
      .call((g) => g.select('.domain').remove())
      .selectAll('text').attr('fill', CHART_COLORS.muted).attr('font-size', '11px');
  }, []);

  return <svg ref={svgRef} className="w-full" />;
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */

function Analytics() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Analytics</h2>
        <p className="text-muted mt-1 text-sm">Analyze fleet data, trends, and financial performance.</p>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden p-5">
          <h3 className="text-sm font-semibold text-accent mb-1">Fuel Efficiency Trend</h3>
          <p className="text-xs text-muted mb-4">Avg km/L over the past 12 months</p>
          <FuelEfficiencyChart />
        </div>

        {/* Top 5 Costliest Vehicles */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden p-5">
          <h3 className="text-sm font-semibold text-accent mb-1">Top 5 Costliest Vehicles</h3>
          <p className="text-xs text-muted mb-4">Total maintenance spend (₹)</p>
          <CostliestVehiclesChart />
        </div>

        {/* India Booking Heatmap */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden p-5">
          <h3 className="text-sm font-semibold text-accent mb-1">Booking Heatmap — India</h3>
          <p className="text-xs text-muted mb-4">Vehicle bookings by city over the past month</p>
          <IndiaHeatmap />
        </div>

        {/* Daily Profit */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden p-5">
          <h3 className="text-sm font-semibold text-accent mb-1">Daily Profit — Feb 2026</h3>
          <p className="text-xs text-muted mb-4">Net profit per day this month</p>
          <DailyProfitChart />
        </div>
      </div>

      {/* ── Financial Summary Table ── */}
      <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden">
        <div className="p-5 pb-0">
          <h3 className="text-sm font-semibold text-accent mb-1">Financial Summary of Month</h3>
          <p className="text-xs text-muted mb-4">Revenue, costs, and net profit breakdown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/5">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Month</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Revenue</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Fuel Cost</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Maintenance</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {FINANCIAL_SUMMARY.map((row, idx) => (
                <tr
                  key={row.month}
                  className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                >
                  <td className="px-5 py-4 text-accent font-medium text-center">{row.month}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-green-300 font-mono font-medium">₹{row.revenue.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-red-300 font-mono font-medium">₹{row.fuelCost.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-yellow-300 font-mono font-medium">₹{row.maintenance.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-mono font-semibold ${row.netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      ₹{row.netProfit.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-5 py-3.5 border-t border-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {FINANCIAL_SUMMARY.length} months
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
