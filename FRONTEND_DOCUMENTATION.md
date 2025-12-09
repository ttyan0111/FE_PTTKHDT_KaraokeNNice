# Karaoke NNice Frontend Documentation

## Project Overview

Professional React + TypeScript web interface for Karaoke N-Nice karaoke business. Allows customers to:
- Browse and book available rooms
- Reserve party packages with customization
- View and apply promotions
- Join membership program with loyalty points
- Track bookings and rewards

## Tech Stack

- **React 18.2.0** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Ant Design 5.11.3** - Component library
- **React Router DOM 6.20.0** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **Zustand 4.4.1** - State management
- **Dayjs** - Date manipulation

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header with responsive menu
│   ├── Header.css          # Header styles
│   ├── HomePage.tsx        # Landing page with hero carousel
│   ├── HomePage.css        # HomePage styles
│   ├── RoomsPage.tsx       # Room listing and booking
│   ├── PartiesPage.tsx     # Party packages and booking
│   ├── PromotionsPage.tsx  # Promotions and discount codes
│   └── MembersPage.tsx     # Loyalty program and rewards
├── services/
│   └── apiClient.ts        # API client with Axios interceptors
├── types/
│   └── index.ts            # TypeScript interfaces
├── App.tsx                 # Main routing component
├── App.css                 # Global styles
├── main.tsx                # Entry point
└── index.css              # Base CSS

```

## Components

### Header Component
**File:** `Header.tsx` / `Header.css`

Navigation component with responsive design:
- **Desktop:** Horizontal menu + Auth buttons
- **Mobile:** Hamburger menu → Drawer navigation
- **Features:**
  - Purple gradient background (#667eea → #764ba2)
  - 5 main pages: Home, Rooms, Parties, Promotions, Members
  - Sticky positioning with z-index 100
  - Mobile breakpoint: 1024px

**Props:**
```typescript
interface HeaderProps {
  onNavigate: (page: string) => void
  currentPage?: string
}
```

### HomePage Component
**File:** `HomePage.tsx` / `HomePage.css`

Landing page showcasing the business:
- **Hero Carousel** (3 slides, auto-play)
  - Booking slide
  - Party packages slide
  - Promotions slide
- **Statistics Section** (4 metrics)
  - 24 rooms
  - 5843+ customers
  - 4.8⭐ rating
  - 5 years operation
- **Features Section** (4 feature cards with hover effects)
  - Quality Sound
  - Rich Songs
  - Food/Drinks
  - Clean Space
- **CTA Section** - Large "Sẵn Sàng Hát?" call-to-action
- **Contact Section** - Phone, address, hours, support

### RoomsPage Component
**File:** `RoomsPage.tsx`

Room listing and booking interface:
- **Features:**
  - 6 sample rooms (VIP, Standard, Group, Couple)
  - Card layout with room details
  - Capacity and price display
  - Availability status badges
  - Booking modal with form
  - Room booking form fields:
    - Customer name, phone, email
    - Date picker (disabled past dates)
    - Time selection (18:00-02:00)
    - Duration (1-8 hours)
    - Guest count
    - Notes

### PartiesPage Component
**File:** `PartiesPage.tsx`

Party package booking interface:
- **4 Party Packages:**
  1. Basic (500K, 3h, 20 people)
  2. Standard (800K, 4h, 30 people)
  3. Premium (1.2M, 5h, 50 people)
  4. VIP (2M, 6h, 100 people)
- **Features:**
  - Detailed service inclusions
  - Add-on services (DJ, Photographer, Decorations)
  - Real-time total calculation
  - Party booking form:
    - Contact information
    - Event date and time
    - Guest count
    - Service add-ons with checkboxes
    - Special requests

### PromotionsPage Component
**File:** `PromotionsPage.tsx`

Promotion viewing and code application:
- **6 Active Promotions:**
  1. WELCOME50 - 50K discount (first booking)
  2. PARTY30 - 30% off party packages
  3. MEMBER25 - 25% member discount
  4. WEEKEND50 - 50K weekend booking discount
  5. LOYALTY100 - 100 points → 100K voucher
  6. REFER50 - 50K referral bonus
- **Features:**
  - Copy-to-clipboard promo codes
  - Validity dates displayed
  - Usage tracking (current/max)
  - Status tags (Active, Expired, Coming Soon)
  - Discount application with modal
  - Minimum order amounts

### MembersPage Component
**File:** `MembersPage.tsx`

Loyalty program and rewards:
- **4 Member Tiers:**
  1. Bronze (0+ points)
  2. Silver (1000+ points)
  3. Gold (5000+ points)
  4. Platinum (10000+ points)
- **Features:**
  - Member info display
  - Current tier with icon
  - Progress to next tier
  - Statistics (total spent, visits)
  - Tier benefits listing
  - Rewards catalog (6 redeemable items)
  - Transaction history table
  - Login requirement for member-only content

## API Integration

### API Client Setup
**File:** `services/apiClient.ts`

Configured Axios instance with:
- Base URL: `http://localhost:8080/api`
- 10-second timeout
- Authorization interceptors
- Bearer token handling
- 401 redirect to login

### Available API Endpoints

**Rooms:**
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/{id}` - Get room details
- `POST /api/rooms/book` - Book a room

**Parties:**
- `GET /api/parties/packages` - Get party packages
- `POST /api/parties/book` - Book party
- `GET /api/parties/{id}` - Get party details

**Promotions:**
- `GET /api/promotions` - List promotions
- `POST /api/promotions/apply/{code}` - Apply promo code
- `GET /api/promotions/validate/{code}` - Validate code

**Members:**
- `GET /api/members/{id}` - Get member profile
- `PUT /api/members/{id}` - Update profile
- `GET /api/members/{id}/points` - Get loyalty points
- `POST /api/members/{id}/redeem` - Redeem reward
- `GET /api/members/{id}/history` - Get transaction history

**Orders:**
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order

**Payments:**
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment

**Check-in:**
- `POST /api/checkin/check-in` - Room check-in
- `POST /api/checkin/check-out` - Room check-out

## Styling Approach

### Design System
- **Primary Color:** #667eea (Purple)
- **Secondary Gradient:** #667eea → #764ba2
- **Accent Color:** #f5576c (Red/Pink)
- **Background:** #f5f5f5
- **Text Color:** #666 (Secondary), #001529 (Dark)

### Responsive Breakpoints
- **Mobile:** < 768px
  - Single column layouts
  - Drawer navigation
  - Adjusted font sizes
- **Tablet:** 768px - 1024px
  - 2-column layouts
  - Mixed navigation
- **Desktop:** > 1024px
  - Full horizontal menu
  - 3-4 column grids
  - Larger spacing

## Running the Application

### Development
```bash
npm install
npm run dev
```
Server runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Backend Connection

Ensure backend API is running on `http://localhost:8080` before starting frontend development.

### Backend Status Check
```bash
curl http://localhost:8080/swagger-ui.html
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Karaoke NNice
```

## TypeScript Interfaces

All DTO types are defined in `src/types/index.ts`:
- OrderRequest/Response
- PaymentRequest/Response
- CheckInRequest/Response
- LoyaltyPointsRequest/Response
- PromotionRequest/Response
- PartyBookingRequest/Response

## Features Not Yet Implemented

- [ ] Authentication system (Login/Signup pages)
- [ ] Real API integration (mock data currently used)
- [ ] User account management
- [ ] Booking confirmation pages
- [ ] Payment gateway integration
- [ ] Zustand state management store
- [ ] Error handling pages
- [ ] Loading states
- [ ] Toast notifications
- [ ] Image uploads

## Future Enhancements

1. **Admin Dashboard** - Manage rooms, bookings, promotions
2. **Real-time Availability** - WebSocket integration
3. **Payment Integration** - Stripe/VNPay
4. **Email Notifications** - Confirmation emails
5. **Mobile App** - React Native version
6. **Analytics** - Customer behavior tracking
7. **Multi-language** - Vietnamese/English support
8. **Social Login** - Google/Facebook OAuth

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - Karaoke NNice

## Support

For issues or questions, contact: info@karaokennice.vn
