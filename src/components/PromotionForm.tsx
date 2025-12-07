import React from 'react'
import { Form, Button, Card, message, Input, List, Tag } from 'antd'
import { apiClient } from '@services/api'
import type { ApDungUuDaiResponse } from '../types/index'

export const PromotionForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [promotionResult, setPromotionResult] = React.useState<ApDungUuDaiResponse | null>(null)
  const [activePromotions, setActivePromotions] = React.useState<ApDungUuDaiResponse[]>([])
  const [showPromotionList, setShowPromotionList] = React.useState(false)

  const onCheckPromo = async (values: { maUuDai: string }) => {
    try {
      setLoading(true)
      const response = await apiClient.checkPromoCode(values.maUuDai)
      setPromotionResult(response)
      message.success('Kiểm tra mã ưu đãi thành công!')
    } catch (error) {
      message.error('Mã ưu đãi không hợp lệ hoặc hết hạn')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivePromotions = async () => {
    try {
      setLoading(true)
      const promotions = await apiClient.getActivePromotions()
      setActivePromotions(promotions)
      setShowPromotionList(true)
    } catch (error) {
      message.error('Lỗi khi tải danh sách ưu đãi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="🎉 Áp Dụng Ưu Đãi & Khuyến Mãi" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onCheckPromo}
      >
        <Form.Item
          label="Mã Ưu Đãi"
          name="maUuDai"
          rules={[{ required: true, message: 'Vui lòng nhập mã ưu đãi' }]}
        >
          <Input placeholder="Nhập mã ưu đãi (VD: KHACHSING, NGAYLE)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ marginBottom: '10px' }}>
            Kiểm Tra Mã Ưu Đãi
          </Button>
          <Button
            type="dashed"
            onClick={fetchActivePromotions}
            loading={loading}
            block
          >
            Xem Tất Cả Ưu Đãi Đang Có
          </Button>
        </Form.Item>
      </Form>

      {promotionResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fffbe6', borderRadius: '4px', border: '1px solid #ffe58f' }}>
          <h3>ℹ️ Chi Tiết Ưu Đãi:</h3>
          <p><strong>Mã Ưu Đãi:</strong> {promotionResult.maUuDai}</p>
          <p><strong>Tên Ưu Đãi:</strong> {promotionResult.tenUuDai}</p>
          <p><strong>Mô Tả:</strong> {promotionResult.moTa}</p>
          <p><strong>Phần Trăm Giảm:</strong> <Tag color="blue">{promotionResult.phanTramGiam}%</Tag></p>
          <p><strong>Giảm Tối Đa:</strong> {promotionResult.giamToiDa.toLocaleString()}đ</p>
          <p><strong>Giảm Tối Thiểu:</strong> {promotionResult.giamToiThieu.toLocaleString()}đ</p>
          <p><strong>Ngày Bắt Đầu:</strong> {new Date(promotionResult.ngayBatDau).toLocaleDateString()}</p>
          <p><strong>Ngày Kết Thúc:</strong> {new Date(promotionResult.ngayKetThuc).toLocaleDateString()}</p>
          <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ Mã ưu đãi hợp lệ</p>
        </div>
      )}

      {showPromotionList && activePromotions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>📋 Danh Sách Ưu Đãi Đang Có:</h3>
          <List
            dataSource={activePromotions}
            renderItem={(promo) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div>
                      <strong>{promo.tenUuDai}</strong>
                      <Tag color="gold" style={{ marginLeft: '10px' }}>
                        {promo.phanTramGiam}% OFF
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p>{promo.moTa}</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        Có hiệu lực từ {new Date(promo.ngayBatDau).toLocaleDateString()} đến{' '}
                        {new Date(promo.ngayKetThuc).toLocaleDateString()}
                      </p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  )
}
