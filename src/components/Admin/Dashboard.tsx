import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Select, Divider, Empty, Spin } from 'antd'
import { UserOutlined, HomeOutlined, ShoppingCartOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { apiClient as api } from '../../services/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface DashboardProps {
  // Empty - all data is fetched from API
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>(null)
  const [yearlyRevenue, setYearlyRevenue] = useState<any>(null)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0)
  const [currentYearRevenue, setCurrentYearRevenue] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [members, setMembers] = useState(0)
  const [rooms, setRooms] = useState(0)
  const [loading, setLoading] = useState(false)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => {
    fetchRevenueData()
    fetchMembersAndRooms()
  }, [selectedYear])

  const fetchMembersAndRooms = async () => {
    try {
      // Lấy tổng số thành viên (từ tất cả thành viên)
      const membersRes = await api.get('/v1/thanh-vien')
      if (membersRes.data && Array.isArray(membersRes.data)) {
        setMembers(membersRes.data.length)
      } else if (membersRes.data && membersRes.data.data) {
        setMembers(membersRes.data.data.length)
      }

      // Lấy tổng số loại phòng
      const roomsRes = await api.get('/v1/loai-phong/tat-ca')
      if (roomsRes.data && Array.isArray(roomsRes.data)) {
        setRooms(roomsRes.data.length)
      } else if (roomsRes.data && roomsRes.data.data) {
        setRooms(roomsRes.data.data.length)
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error)
    }
  }

  const fetchRevenueData = async () => {
    try {
      // Lấy doanh thu theo tháng
      const monthRes = await api.get(`/v1/doanh-thu/theo-thang?year=${selectedYear}`)
      if (monthRes.data.success) {
        setMonthlyRevenue(monthRes.data.data)
      }

      // Lấy doanh thu theo năm
      const yearRes = await api.get('/v1/doanh-thu/theo-nam')
      if (yearRes.data.success) {
        setYearlyRevenue(yearRes.data.data)
      }

      // Lấy doanh thu hôm nay
      const todayRes = await api.get('/v1/doanh-thu/hom-nay')
      if (todayRes.data.success) {
        setTodayRevenue(parseFloat(todayRes.data.data) / 1000000)
      }

      // Lấy doanh thu tháng này
      const monthThisRes = await api.get('/v1/doanh-thu/thang-nay')
      if (monthThisRes.data.success) {
        setCurrentMonthRevenue(parseFloat(monthThisRes.data.data) / 1000000)
      }

      // Lấy doanh thu năm này
      const yearThisRes = await api.get('/v1/doanh-thu/nam-nay')
      if (yearThisRes.data.success) {
        setCurrentYearRevenue(parseFloat(yearThisRes.data.data) / 1000000)
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu doanh thu:', error)
    }
  }

  // Prepare data for monthly chart
  const monthlyChartData = monthlyRevenue
    ? {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: `Doanh Thu Năm ${selectedYear} (Triệu VNĐ)`,
            data: Object.keys(monthlyRevenue.data)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((month) => parseFloat(monthlyRevenue.data[month]) / 1000000),
            borderColor: '#1890ff',
            backgroundColor: 'rgba(24, 144, 255, 0.1)',
            tension: 0.4,
          },
        ],
      }
    : null

  // Prepare data for yearly chart
  const yearlyChartData = yearlyRevenue
    ? {
        labels: Object.keys(yearlyRevenue.data).sort(),
        datasets: [
          {
            label: 'Doanh Thu Hàng Năm (Triệu VNĐ)',
            data: Object.keys(yearlyRevenue.data)
              .sort()
              .map((year) => parseFloat(yearlyRevenue.data[year]) / 1000000),
            backgroundColor: 'rgba(82, 196, 26, 0.6)',
            borderColor: '#52c41a',
            borderWidth: 1,
          },
        ],
      }
    : null

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '32px', fontSize: '28px', fontWeight: '600', color: '#1f2937' }}>
        📊 Dashboard Quản Lý
      </h1>

      {/* Top Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={12}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng Thành Viên</span>}
              value={members}
              prefix={<UserOutlined />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng Phòng</span>}
              value={rooms}
              prefix={<HomeOutlined />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: '600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Summary */}
      <Card style={{ marginBottom: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          💰 Doanh Thu Tổng Quát
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#fff7ed', borderRadius: '8px' }}>
              <Statistic
                title="Hôm Nay"
                value={todayRevenue}
                precision={1}
                suffix="Triệu"
                valueStyle={{ color: '#f59e0b', fontSize: '24px', fontWeight: '600' }}
                prefix={<DollarOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#ecf0ff', borderRadius: '8px' }}>
              <Statistic
                title="Tháng Này"
                value={currentMonthRevenue}
                precision={1}
                suffix="Triệu"
                valueStyle={{ color: '#3b82f6', fontSize: '24px', fontWeight: '600' }}
                prefix={<DollarOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
              <Statistic
                title="Năm Nay"
                value={currentYearRevenue}
                precision={1}
                suffix="Triệu"
                valueStyle={{ color: '#22c55e', fontSize: '24px', fontWeight: '600' }}
                prefix={<DollarOutlined />}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📈 Doanh Thu Theo Tháng</span>
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  style={{ width: '120px' }}
                  options={years.map((year) => ({ label: year.toString(), value: year }))}
                />
              </div>
            }
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {monthlyChartData ? (
              <Line
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      padding: 12,
                      cornerRadius: 8,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#666' },
                      grid: { color: '#e5e7eb' },
                    },
                    x: {
                      ticks: { color: '#666' },
                      grid: { color: '#f3f4f6' },
                    },
                  },
                }}
              />
            ) : (
              <Spin />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="📊 Doanh Thu Theo Năm"
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {yearlyChartData ? (
              <Bar
                data={yearlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      padding: 12,
                      cornerRadius: 8,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#666' },
                      grid: { color: '#e5e7eb' },
                    },
                    x: {
                      ticks: { color: '#666' },
                      grid: { color: '#f3f4f6' },
                    },
                  },
                }}
              />
            ) : (
              <Spin />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
