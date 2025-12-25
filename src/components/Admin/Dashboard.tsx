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
  const [employees, setEmployees] = useState(0)
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
      // Lấy tổng số nhân viên
      const employeesRes = await api.get('/v1/quan-ly-tai-khoan-nhan-vien/danh-sach')
      let employeeData = employeesRes.data
      if (employeeData && typeof employeeData === 'object' && !Array.isArray(employeeData)) {
        employeeData = employeeData.data || employeeData.content || employeeData.employees || employeeData.nhanViens || []
      }
      setEmployees(Array.isArray(employeeData) ? employeeData.length : 0)

      // Lấy tổng số phòng
      const roomsRes = await api.get('/v1/phong/tat-ca')
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
      setLoading(true)
      // Lấy tất cả hóa đơn để tính doanh thu
      const hoaDonRes = await api.get('/v1/hoa-don/tat-ca')
      const allInvoices = Array.isArray(hoaDonRes.data) ? hoaDonRes.data : []
      
      // Tính doanh thu theo tháng cho năm được chọn
      const monthlyData: Record<number, number> = {}
      for (let i = 1; i <= 12; i++) {
        monthlyData[i] = 0
      }
      
      const today = new Date()
      let todayTotal = 0
      let thisMonthTotal = 0
      
      allInvoices.forEach((inv: any) => {
        const amount = Number(inv.tongTien) || 0
        const invoiceDate = new Date(inv.ngayLap)
        const invoiceMonth = invoiceDate.getMonth() + 1
        const invoiceYear = invoiceDate.getFullYear()
        
        // Doanh thu theo tháng (cho năm được chọn)
        if (invoiceYear === selectedYear) {
          monthlyData[invoiceMonth] = (monthlyData[invoiceMonth] || 0) + amount
        }
        
        // Doanh thu hôm nay
        if (invoiceDate.toDateString() === today.toDateString()) {
          todayTotal += amount
        }
        
        // Doanh thu tháng này
        if (invoiceMonth === today.getMonth() + 1 && invoiceYear === today.getFullYear()) {
          thisMonthTotal += amount
        }
      })
      
      setMonthlyRevenue(monthlyData)
      setTodayRevenue(todayTotal / 1000000)
      setCurrentMonthRevenue(thisMonthTotal / 1000000)
      
      // Tính doanh thu theo năm
      const yearlyData: Record<number, number> = {}
      allInvoices.forEach((inv: any) => {
        const amount = Number(inv.tongTien) || 0
        const invoiceDate = new Date(inv.ngayLap)
        const invoiceYear = invoiceDate.getFullYear()
        yearlyData[invoiceYear] = (yearlyData[invoiceYear] || 0) + amount
      })
      
      setYearlyRevenue(yearlyData)
      
      // Doanh thu năm nay
      const currentYearTotal = yearlyData[today.getFullYear()] || 0
      setCurrentYearRevenue(currentYearTotal / 1000000)
    } catch (error) {
      console.error('Lỗi lấy dữ liệu doanh thu:', error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for monthly chart
  const monthlyChartData = monthlyRevenue && Object.keys(monthlyRevenue).length > 0
    ? {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: `Doanh Thu Năm ${selectedYear} (Triệu VNĐ)`,
            data: Object.keys(monthlyRevenue)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((month) => {
                const value = monthlyRevenue[month]
                return typeof value === 'number' ? value / 1000000 : 0
              }),
            borderColor: '#1890ff',
            backgroundColor: 'rgba(24, 144, 255, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null

  // Prepare data for yearly chart
  const yearlyChartData = yearlyRevenue && Object.keys(yearlyRevenue).length > 0
    ? {
        labels: Object.keys(yearlyRevenue).sort(),
        datasets: [
          {
            label: 'Doanh Thu Hàng Năm (Triệu VNĐ)',
            data: Object.keys(yearlyRevenue)
              .sort()
              .map((year) => {
                const value = yearlyRevenue[year]
                return typeof value === 'number' ? value / 1000000 : 0
              }),
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng Nhân Viên</span>}
              value={employees}
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
