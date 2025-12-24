import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Modal, message, Tag, Row, Col, Space, Select } from 'antd'
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons'
import { apiClient } from '../../services/api'
import dayjs from 'dayjs'
import viVN from 'dayjs/locale/vi'

dayjs.locale(viVN)

interface Invoice {
  maHD: number
  maPhieuSuDung: number
  maKH: number
  ngayLap: string
  tienPhong: number
  tienDichVu: number
  tongTienChuaThue: number
  thueVAT: number
  giamGia: number
  tongTien: number
  tienCocDaTra: number
  conPhaiTra: number
  hinhThucThanhToan: string
  trangThai: string
  maNVThanhToan?: number
}

interface InvoiceManagementProps {
  onDataUpdate?: () => void
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ onDataUpdate }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      // Gọi API thực từ backend
      const response = await apiClient.getAllHoaDon()
      
      // Convert BigDecimal từ backend thành number
      const invoices = Array.isArray(response) ? response.map((inv: any) => ({
        maHD: inv.maHD,
        maPhieuSuDung: inv.phieuSuDung?.maPhieuSuDung || inv.maPhieuSuDung,
        maKH: inv.khachHang?.maKH || inv.maKH,
        ngayLap: inv.ngayLap,
        tienPhong: Number(inv.tienPhong) || 0,
        tienDichVu: Number(inv.tienDichVu) || 0,
        tongTienChuaThue: Number(inv.tongTienChuaThue) || 0,
        thueVAT: Number(inv.thueVAT) || 0,
        giamGia: Number(inv.giamGia) || 0,
        tongTien: Number(inv.tongTien) || 0,
        tienCocDaTra: Number(inv.tienCocDaTra) || 0,
        conPhaiTra: Number(inv.conPhaiTra) || 0,
        hinhThucThanhToan: inv.hinhThucThanhToan || '',
        trangThai: inv.trangThai || 'Chưa thanh toán'
      })) : []
      
      setInvoices(invoices)
    } catch (err: any) {
      message.error('Lỗi tải dữ liệu: ' + (err.message || 'Không thể kết nối server'))
      // Fallback to mock data nếu lỗi
      setInvoices(getMockInvoices())
    } finally {
      setLoading(false)
    }
  }

  // Mock data để fallback
  const getMockInvoices = (): Invoice[] => [
    {
      maHD: 1,
      maPhieuSuDung: 101,
      maKH: 1,
      ngayLap: '2025-12-24T14:30:00',
      tienPhong: 200000,
      tienDichVu: 125000,
      tongTienChuaThue: 325000,
      thueVAT: 32500,
      giamGia: 0,
      tongTien: 357500,
      tienCocDaTra: 100000,
      conPhaiTra: 257500,
      hinhThucThanhToan: 'Tiền mặt',
      trangThai: 'Chưa thanh toán'
    },
    {
      maHD: 2,
      maPhieuSuDung: 102,
      maKH: 2,
      ngayLap: '2025-12-24T16:00:00',
      tienPhong: 250000,
      tienDichVu: 180000,
      tongTienChuaThue: 430000,
      thueVAT: 43000,
      giamGia: 50000,
      tongTien: 423000,
      tienCocDaTra: 200000,
      conPhaiTra: 223000,
      hinhThucThanhToan: 'Thẻ',
      trangThai: 'Chưa thanh toán'
    },
    {
      maHD: 3,
      maPhieuSuDung: 103,
      maKH: 3,
      ngayLap: '2025-12-23T18:30:00',
      tienPhong: 150000,
      tienDichVu: 95000,
      tongTienChuaThue: 245000,
      thueVAT: 24500,
      giamGia: 0,
      tongTien: 269500,
      tienCocDaTra: 269500,
      conPhaiTra: 0,
      hinhThucThanhToan: 'Chuyển khoản',
      trangThai: 'Đã thanh toán'
    },
    {
      maHD: 4,
      maPhieuSuDung: 104,
      maKH: 4,
      ngayLap: '2025-12-23T20:00:00',
      tienPhong: 300000,
      tienDichVu: 220000,
      tongTienChuaThue: 520000,
      thueVAT: 52000,
      giamGia: 30000,
      tongTien: 542000,
      tienCocDaTra: 542000,
      conPhaiTra: 0,
      hinhThucThanhToan: 'Tiền mặt',
      trangThai: 'Đã thanh toán'
    }
  ]

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDetailModalVisible(true)
  }

  const handlePrint = () => {
    if (!printRef.current) return
    
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) {
      message.error('Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt.')
      return
    }

    const printContent = printRef.current.innerHTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Hóa Đơn #${selectedInvoice?.maHD}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .invoice-title { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .invoice-subtitle { font-size: 12px; color: #666; }
          .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-section { font-size: 13px; line-height: 1.6; }
          .info-label { font-weight: bold; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .invoice-table th { background: #f5f5f5; border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold; }
          .invoice-table td { border: 1px solid #ddd; padding: 10px; }
          .invoice-table .amount { text-align: right; }
          .invoice-footer { margin-top: 30px; border-top: 2px solid #000; padding-top: 10px; }
          .total-row { font-weight: bold; font-size: 16px; }
          .footer-note { font-size: 12px; color: #666; margin-top: 20px; text-align: center; }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">HOÁ ĐƠN THANH TOÁN</div>
          <div class="invoice-subtitle">Invoice #${selectedInvoice?.maHD}</div>
        </div>

        <div class="invoice-info">
          <div class="info-section">
            <div><span class="info-label">Mã Hóa Đơn:</span> ${selectedInvoice?.maHD}</div>
            <div><span class="info-label">Mã Phiếu:</span> ${selectedInvoice?.maPhieuSuDung}</div>
            <div><span class="info-label">Ngày Lập:</span> ${dayjs(selectedInvoice?.ngayLap).format('DD/MM/YYYY HH:mm')}</div>
          </div>
          <div class="info-section">
            <div><span class="info-label">Khách Hàng:</span> KH-${selectedInvoice?.maKH}</div>
            <div><span class="info-label">Hình Thức TT:</span> ${selectedInvoice?.hinhThucThanhToan}</div>
            <div><span class="info-label">Trạng Thái:</span> ${selectedInvoice?.trangThai}</div>
          </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Chi Tiết</th>
              <th class="amount">Số Tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiền Phòng</td>
              <td class="amount">${selectedInvoice?.tienPhong.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr>
              <td>Tiền Dịch Vụ (Ăn, Uống)</td>
              <td class="amount">${selectedInvoice?.tienDichVu.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td><strong>Cộng</strong></td>
              <td class="amount"><strong>${selectedInvoice?.tongTienChuaThue.toLocaleString('vi-VN')}₫</strong></td>
            </tr>
            <tr>
              <td>VAT (10%)</td>
              <td class="amount">+ ${selectedInvoice?.thueVAT.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr>
              <td>Giảm Giá</td>
              <td class="amount">- ${selectedInvoice?.giamGia.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr style="background: #e6f7ff;">
              <td class="total-row">Tổng Cộng</td>
              <td class="amount total-row">${selectedInvoice?.tongTien.toLocaleString('vi-VN')}₫</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-footer">
          <div style="margin-bottom: 10px;">
            <div><strong>Thanh Toán:</strong></div>
            <div>Tiền Cọc Đã Trả: <strong>${selectedInvoice?.tienCocDaTra.toLocaleString('vi-VN')}₫</strong></div>
            <div>Còn Phải Trả: <strong>${selectedInvoice?.conPhaiTra.toLocaleString('vi-VN')}₫</strong></div>
          </div>
        </div>

        <div class="footer-note">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!<br>
          Ngày in: ${dayjs().format('DD/MM/YYYY HH:mm')}
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // Lọc hóa đơn theo trạng thái
  const filteredInvoices = filterStatus
    ? invoices.filter(inv => inv.trangThai === filterStatus)
    : invoices

  const columns = [
    {
      title: 'Mã HĐ',
      dataIndex: 'maHD',
      key: 'maHD',
      width: 70,
      sorter: (a: Invoice, b: Invoice) => a.maHD - b.maHD
    },
    {
      title: 'Ngày Lập',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Invoice, b: Invoice) => new Date(a.ngayLap).getTime() - new Date(b.ngayLap).getTime()
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 150,
      render: (amount: number) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{amount.toLocaleString('vi-VN')}₫</span>,
      align: 'right' as const,
      sorter: (a: Invoice, b: Invoice) => a.tongTien - b.tongTien
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'Đã thanh toán' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 80,
      render: (_: any, record: Invoice) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          title="Xem chi tiết"
        >
          Chi tiết
        </Button>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <span>Lọc:</span>
          <Select
            placeholder="Tất cả"
            style={{ width: 200 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: 'Đã thanh toán', value: 'Đã thanh toán' },
              { label: 'Chưa thanh toán', value: 'Chưa thanh toán' }
            ]}
          />
          <Button type="primary" onClick={fetchInvoices} loading={loading}>
            ↻ Làm mới
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="maHD"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
        />
      </Card>

      {/* Chi tiết hóa đơn */}
      <Modal
        title={`Hóa Đơn #${selectedInvoice?.maHD}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            🖨️ In Hóa Đơn
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        <div ref={printRef}>
          {selectedInvoice && (
            <div style={{ lineHeight: 2 }}>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div><strong>Mã HĐ:</strong> {selectedInvoice.maHD}</div>
                <div><strong>Ngày Lập:</strong> {dayjs(selectedInvoice.ngayLap).format('DD/MM/YYYY HH:mm')}</div>
                <div><strong>Mã Phiếu Sử Dụng:</strong> {selectedInvoice.maPhieuSuDung}</div>
              </Col>
              <Col span={12}>
                <div><strong>Khách Hàng:</strong> KH-{selectedInvoice.maKH}</div>
                <div><strong>Hình Thức TT:</strong> {selectedInvoice.hinhThucThanhToan}</div>
                <div><strong>Trạng Thái:</strong> <Tag color={selectedInvoice.trangThai === 'Đã thanh toán' ? 'green' : 'orange'}>{selectedInvoice.trangThai}</Tag></div>
              </Col>
            </Row>

            <Card size="small" title="Chi Tiết Chi Phí" style={{ marginBottom: '16px' }}>
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>Tiền Phòng:</span> <span>{selectedInvoice.tienPhong.toLocaleString('vi-VN')}₫</span></Row>
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>Tiền Dịch Vụ:</span> <span>{selectedInvoice.tienDichVu.toLocaleString('vi-VN')}₫</span></Row>
              <hr style={{ margin: '8px 0' }} />
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>Cộng:</span> <span>{selectedInvoice.tongTienChuaThue.toLocaleString('vi-VN')}₫</span></Row>
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>VAT (10%):</span> <span>+{selectedInvoice.thueVAT.toLocaleString('vi-VN')}₫</span></Row>
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>Giảm Giá:</span> <span style={{ color: '#52c41a' }}>-{selectedInvoice.giamGia.toLocaleString('vi-VN')}₫</span></Row>
              <hr style={{ margin: '8px 0' }} />
              <Row justify="space-between" style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}><span>Tổng Cộng:</span> <span>{selectedInvoice.tongTien.toLocaleString('vi-VN')}₫</span></Row>
            </Card>

            <Card size="small" title="Thanh Toán">
              <Row justify="space-between" style={{ marginBottom: '8px' }}><span>Tiền Cọc Đã Trả:</span> <span>{selectedInvoice.tienCocDaTra.toLocaleString('vi-VN')}₫</span></Row>
              <Row justify="space-between" style={{ fontSize: 16, fontWeight: 600, color: selectedInvoice.conPhaiTra > 0 ? '#ff4d4f' : '#52c41a' }}>
                <span>Còn Phải Trả:</span> <span>{selectedInvoice.conPhaiTra.toLocaleString('vi-VN')}₫</span>
              </Row>
            </Card>
          </div>
          )}
        </div>
      </Modal>
    </div>
  )
}