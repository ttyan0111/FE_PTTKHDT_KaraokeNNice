import React from 'react'
import { Form, Button, Card, message, InputNumber, DatePicker, Table, Tag, Modal, Select, Alert, Descriptions, Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@services/api'
import { useAuth } from '../hooks/useAuth'
import type { DatTiecResponse, GoiTiecResponse, SanhTiecResponse } from '../types/index'
import dayjs from 'dayjs'

const { Option } = Select

export const PartiesPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [bookingResult, setBookingResult] = React.useState<DatTiecResponse | null>(null)
  const [bookingList, setBookingList] = React.useState<DatTiecResponse[]>([])
  const [showList, setShowList] = React.useState(false)
  const [partyPackages, setPartyPackages] = React.useState<GoiTiecResponse[]>([])
  const [banquetHalls, setBanquetHalls] = React.useState<SanhTiecResponse[]>([])
  const [filteredHalls, setFilteredHalls] = React.useState<SanhTiecResponse[]>([])
  const [expectedGuests, setExpectedGuests] = React.useState<number>(0)
  const [selectedPackage, setSelectedPackage] = React.useState<GoiTiecResponse | null>(null)
  const [selectedHall, setSelectedHall] = React.useState<SanhTiecResponse | null>(null)
  const [estimatedTotal, setEstimatedTotal] = React.useState<number>(0)

  React.useEffect(() => {
    fetchPartyPackages()
    fetchBanquetHalls()
    
    // Auto-fill customer ID if logged in
    if (isAuthenticated && user?.maKhachHang) {
      form.setFieldsValue({ maKhachHang: user.maKhachHang })
    }
  }, [])

  React.useEffect(() => {
    if (expectedGuests > 0) {
      const filtered = banquetHalls.filter(hall => hall.sucChua >= expectedGuests && hall.trangThai === 'TRONG')
      setFilteredHalls(filtered)
      
      // Reset hall selection if current selection is no longer valid
      const currentHallId = form.getFieldValue('maSanh')
      if (currentHallId && !filtered.find(h => h.maSanh === currentHallId)) {
        form.setFieldsValue({ maSanh: undefined })
        setSelectedHall(null)
      }
    } else {
      setFilteredHalls(banquetHalls.filter(hall => hall.trangThai === 'TRONG'))
    }
  }, [expectedGuests, banquetHalls])

  React.useEffect(() => {
    // Calculate estimated total
    if (selectedPackage && selectedHall && expectedGuests > 0) {
      const total = (selectedPackage.giaTronGoi * expectedGuests) + selectedHall.giaThue
      setEstimatedTotal(total)
    } else {
      setEstimatedTotal(0)
    }
  }, [selectedPackage, selectedHall, expectedGuests])

  const fetchPartyPackages = async () => {
    try {
      const packages = await apiClient.getAllPartyPackages()
      setPartyPackages(packages)
    } catch (error) {
      console.error('Failed to fetch party packages:', error)
    }
  }

  const fetchBanquetHalls = async () => {
    try {
      const halls = await apiClient.getAllBanquetHalls()
      setBanquetHalls(halls)
    } catch (error) {
      console.error('Failed to fetch banquet halls:', error)
    }
  }

  const onCreateBooking = async (values: any) => {
    // Check authentication before booking
    if (!isAuthenticated || !user) {
      Modal.confirm({
        title: 'Yeu cau dang nhap',
        content: 'Ban can dang nhap de dat tiec. Ban muon dang nhap ngay?',
        okText: 'Dang nhap',
        cancelText: 'Huy',
        onOk() {
          navigate('/login')
        }
      })
      return
    }

    // Final confirmation
    Modal.confirm({
      title: 'Xac nhan dat tiec',
      content: `Ban co chac chan muon dat tiec voi tong tien du kien ${estimatedTotal.toLocaleString()}d?`,
      okText: 'Xac nhan',
      cancelText: 'Huy',
      onOk: async () => {
        try {
          setLoading(true)
          const response = await apiClient.createPartyBooking({
            maKH: user.maKhachHang || values.maKhachHang,
            maGoi: values.maGoiTiec,
            maSanh: values.maSanh,
            ngayToChuc: values.ngayToChuc.format('YYYY-MM-DD'),
            soLuongNguoi: values.soLuongNguoiDuKien
          })
          setBookingResult(response)
          message.success('Dat tiec thanh cong! Vui long thanh toan dat coc de giu cho.')
          form.resetFields()
          // Re-fill customer ID after reset
          if (user?.maKhachHang) {
            form.setFieldsValue({ maKhachHang: user.maKhachHang })
          }
          fetchBanquetHalls() // Refresh banquet halls availability
          setSelectedPackage(null)
          setSelectedHall(null)
          setExpectedGuests(0)
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Loi khi dat tiec')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const fetchBookingList = async () => {
    // Check authentication before fetching
    if (!isAuthenticated) {
      Modal.confirm({
        title: 'Yeu cau dang nhap',
        content: 'Ban can dang nhap de xem danh sach dat tiec. Ban muon dang nhap ngay?',
        okText: 'Dang nhap',
        cancelText: 'Huy',
        onOk() {
          navigate('/login')
        }
      })
      return
    }

    try {
      setLoading(true)
      const list = await apiClient.getPartyBookingList('CHUA_DUNG')
      setBookingList(list)
      setShowList(true)
    } catch (error) {
      message.error('Loi khi tai danh sach dat tiec')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Ma Dat Tiec',
      dataIndex: 'maDonDatTiec',
      key: 'maDonDatTiec',
    },
    {
      title: 'Khach Hang',
      dataIndex: 'tenKH',
      key: 'tenKH',
    },
    {
      title: 'Goi Tiec',
      dataIndex: 'tenGoi',
      key: 'tenGoi',
    },
    {
      title: 'Ngay To Chuc',
      dataIndex: 'ngayToChuc',
      key: 'ngayToChuc',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'So Nguoi',
      dataIndex: 'soLuongNguoi',
      key: 'soLuongNguoi',
    },
    {
      title: 'Tong Tien',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (amount: number) => `${amount.toLocaleString()}d`,
    },
    {
      title: 'Trang Thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={status === 'DA_DUNG' ? 'green' : 'orange'}>
          {status === 'DA_DUNG' ? 'Da Dung' : 'Chua Dung'}
        </Tag>
      ),
    },
  ]

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <Card 
        title="🎊 Dat Tiec Karaoke" 
        className="form-card"
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Alert
          message="Huong dan dat tiec"
          description="1. Chon goi tiec phu hop | 2. Nhap so luong khach | 3. Chon sanh tiec (tu dong loc theo so nguoi) | 4. Chon ngay to chuc | 5. Xac nhan dat tiec"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onCreateBooking}
        >
          <Form.Item
            label="Ma Khach Hang"
            name="maKhachHang"
            rules={[{ required: true, message: 'Vui long nhap ma khach hang' }]}
            tooltip="Neu da dang nhap, ma khach hang se tu dong dien vao"
          >
            <InputNumber 
              placeholder="Nhap ma khach hang" 
              style={{ width: '100%' }}
              disabled={isAuthenticated && !!user?.maKhachHang}
            />
          </Form.Item>

          <Form.Item
            label="Goi Tiec"
            name="maGoiTiec"
            rules={[{ required: true, message: 'Vui long chon goi tiec' }]}
            tooltip="Chon goi tiec phu hop voi ngan sach cua ban"
          >
            <Select 
              placeholder="Chon goi tiec" 
              loading={partyPackages.length === 0}
              onChange={(value) => {
                const pkg = partyPackages.find(p => p.maGoi === value)
                setSelectedPackage(pkg || null)
              }}
            >
              {partyPackages.map(pkg => (
                <Option key={pkg.maGoi} value={pkg.maGoi}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pkg.tenGoi}</span>
                    <strong style={{ color: '#1890ff' }}>{pkg.giaTronGoi.toLocaleString()}d/nguoi</strong>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="So Luong Khach Du Kien"
            name="soLuongNguoiDuKien"
            rules={[
              { required: true, message: 'Vui long nhap so luong nguoi' },
              { type: 'number', min: 10, message: 'Toi thieu 10 nguoi' }
            ]}
            tooltip="Nhap so nguoi du kien tham gia tiec"
          >
            <InputNumber 
              placeholder="Nhap so luong nguoi (toi thieu 10)" 
              style={{ width: '100%' }}
              min={10}
              onChange={(value) => setExpectedGuests(value || 0)}
            />
          </Form.Item>

          {expectedGuests > 0 && filteredHalls.length === 0 && (
            <Alert
              message="Khong co sanh phu hop"
              description={`Khong tim thay sanh tiec voi suc chua ${expectedGuests} nguoi. Vui long giam so nguoi hoac lien he de dat sanh rieng.`}
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          <Form.Item
            label="Sanh Tiec"
            name="maSanh"
            rules={[{ required: true, message: 'Vui long chon sanh tiec' }]}
            tooltip="Chi hien thi cac sanh co suc chua phu hop"
          >
            <Select 
              placeholder={expectedGuests > 0 ? `Chon sanh tiec (du ${expectedGuests} nguoi)` : "Vui long nhap so nguoi truoc"} 
              loading={banquetHalls.length === 0}
              disabled={expectedGuests === 0}
              onChange={(value) => {
                const hall = banquetHalls.find(h => h.maSanh === value)
                setSelectedHall(hall || null)
              }}
            >
              {filteredHalls.map(hall => (
                <Option key={hall.maSanh} value={hall.maSanh}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{hall.tenSanh}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Suc chua: {hall.sucChua} nguoi | Dien tich: {hall.dienTich}m² | 
                      <span style={{ color: '#1890ff', fontWeight: 'bold' }}> {hall.giaThue.toLocaleString()}d</span>
                    </div>
                    {hall.moTa && <div style={{ fontSize: '11px', color: '#999' }}>{hall.moTa}</div>}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngay To Chuc"
            name="ngayToChuc"
            rules={[
              { required: true, message: 'Vui long chon ngay to chuc' },
              {
                validator: (_, value) => {
                  if (value && value.isBefore(dayjs(), 'day')) {
                    return Promise.reject('Ngay to chuc phai sau ngay hom nay')
                  }
                  return Promise.resolve()
                }
              }
            ]}
            tooltip="Chon ngay to chuc tiec (phai tu ngay mai tro di)"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              placeholder="Chon ngay to chuc"
            />
          </Form.Item>

          {estimatedTotal > 0 && (
            <>
              <Divider />
              <Card 
                size="small" 
                style={{ 
                  backgroundColor: '#e6f7ff', 
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: '1px solid #91d5ff'
                }}
              >
                <Descriptions title="Du Toan Chi Phi" column={1} size="small">
                  <Descriptions.Item label="Goi tiec">
                    {selectedPackage?.giaTronGoi.toLocaleString()}d x {expectedGuests} nguoi = 
                    <strong style={{ color: '#1890ff' }}> {(selectedPackage!.giaTronGoi * expectedGuests).toLocaleString()}d</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thue sanh tiec">
                    <strong style={{ color: '#1890ff' }}>{selectedHall?.giaThue.toLocaleString()}d</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tong cong">
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                      {estimatedTotal.toLocaleString()}d
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Dat coc (20%)">
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                      {(estimatedTotal * 0.2).toLocaleString()}d
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{ marginBottom: '10px' }}
              disabled={!estimatedTotal}
            >
              {estimatedTotal > 0 ? `Xac Nhan Dat Tiec - ${estimatedTotal.toLocaleString()}d` : 'Dat Tiec'}
            </Button>
            <Button
              type="dashed"
              onClick={fetchBookingList}
              loading={loading}
              block
            >
              Xem Lich Su Dat Tiec
            </Button>
          </Form.Item>
        </Form>

        {bookingResult && (
          <Card 
            title="✅ Dat Tiec Thanh Cong!" 
            style={{ 
              marginTop: '20px', 
              borderColor: '#52c41a',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(82,196,65,0.2)'
            }}
            styles={{ body: { backgroundColor: '#f6ffed' } }}
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ma Don Dat">{bookingResult.maDonDatTiec}</Descriptions.Item>
              <Descriptions.Item label="Khach Hang">{bookingResult.tenKH}</Descriptions.Item>
              <Descriptions.Item label="Goi Tiec">{bookingResult.tenGoi}</Descriptions.Item>
              <Descriptions.Item label="Ngay To Chuc">
                {new Date(bookingResult.ngayToChuc).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="So Nguoi">{bookingResult.soLuongNguoi} nguoi</Descriptions.Item>
              <Descriptions.Item label="Tong Tien">
                <strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  {bookingResult.tongTien.toLocaleString()}d
                </strong>
              </Descriptions.Item>
            </Descriptions>
            <Alert
              message="Luu y"
              description="Vui long thanh toan dat coc 20% trong vong 24h de giu cho. Lien he: 0123-456-789"
              type="success"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>
        )}

        {showList && bookingList.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Divider />
            <h3>📋 Lich Su Dat Tiec Cua Ban:</h3>
            <Table
              columns={columns}
              dataSource={bookingList}
              rowKey="maDonDatTiec"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </div>
        )}

        {showList && bookingList.length === 0 && (
          <Alert
            message="Chua co don dat tiec nao"
            description="Ban chua co lich su dat tiec. Hay tao don dat tiec dau tien!"
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
      </Card>
    </div>
  )
}

