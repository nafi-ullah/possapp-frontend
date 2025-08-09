# Admin Dashboard Documentation

## Overview
The Admin Dashboard is a comprehensive management interface for the POS system that integrates all the APIs mentioned in the main README.md file. It provides a clean, modern UI with separate components for different functionalities.

## Features

### 1. Dashboard Overview
- **Total Users**: Shows the count of all system users
- **Total Products**: Displays the number of products in inventory
- **Total Sales**: Count of completed sales transactions
- **Total Revenue**: Sum of all sales revenue
- **Low Stock Alert**: Products with stock quantity ≤ 10
- **Pending Orders**: Orders with "Created" status
- **Completed Orders**: Orders with "Paid" status
- **Average Order Value**: Mean transaction value

### 2. User Management
- **Create Users**: Add new users with username, password, and role
- **View Users**: Display existing users with their roles
- **Edit Users**: Modify user information (UI ready, backend integration pending)
- **Delete Users**: Remove users from the system (UI ready, backend integration pending)

**API Endpoint**: `POST /api/Users`

### 3. Product Management
- **Create Products**: Add new products with barcode, name, unit, price, and stock
- **View Products**: Display all products in a sortable table
- **Edit Products**: Inline editing for product details
- **Delete Products**: Remove products with confirmation
- **Stock Management**: Visual indicators for low stock items

**API Endpoints**:
- `GET /api/Products` - Fetch all products
- `POST /api/Products` - Create new product
- `PUT /api/Products/{id}` - Update product
- `DELETE /api/Products/{id}` - Delete product

### 4. Sales Information
- **Sales Overview**: Revenue, order counts, and pending orders
- **Batch Management**: View all sales batches with status tracking
- **Order Details**: See individual items in each batch
- **Status Updates**: Change batch status, payment method, and amounts
- **Discount Management**: Apply discounts and handle returns

**API Endpoints**:
- `GET /api/Batches` - Fetch all sales batches
- `PUT /api/Batches/{id}/status` - Update batch status and details

## Technical Implementation

### Components Structure
```
components/admin/
├── AdminTabs.tsx          # Main tab navigation
├── DashboardOverview.tsx  # Statistics overview cards
├── UserManagement.tsx     # User CRUD operations
├── ProductManagement.tsx  # Product CRUD operations
└── SalesInformation.tsx   # Sales and batch management
```

### Custom Hooks
- `useAdminStats()`: Fetches and manages dashboard statistics

### UI Components Used
- **shadcn/ui**: Card, Button, Input, Table, Select, Badge
- **Lucide React**: Beautiful icons for enhanced UX
- **Tailwind CSS**: Responsive design and styling

### State Management
- React hooks for local state management
- Async API calls with loading states
- Error handling and user feedback

## Usage Instructions

### 1. Accessing the Dashboard
Navigate to `/admin` in your application to access the admin dashboard.

### 2. Navigation
Use the tab navigation at the top to switch between different sections:
- **Overview**: Dashboard statistics and metrics
- **User Management**: Manage system users
- **Product Management**: Handle inventory
- **Sales Information**: Monitor sales and orders

### 3. Data Refresh
Click the "Refresh Data" button to fetch the latest information from the backend.

### 4. Creating New Items
- **Users**: Fill in username, password, and select role
- **Products**: Enter barcode, name, unit, price, and stock quantity
- **Batches**: Use the batch management interface to update status

### 5. Editing Items
- **Products**: Click the edit button to enable inline editing
- **Batches**: Use the "Manage" button to update batch details

## API Integration

### Base URL
The dashboard uses the backend base URL from `lib/constants.ts`:
```typescript
export const BackendBaseUrl = 
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://15.207.114.87:5082";
```

### Error Handling
- Network errors are caught and displayed to users
- Loading states prevent multiple simultaneous requests
- Retry mechanisms for failed API calls

### Data Validation
- Form validation for required fields
- Confirmation dialogs for destructive actions
- Input sanitization and type checking

## Styling and Design

### Color Scheme
- **Primary**: Blue tones for main actions
- **Success**: Green for positive metrics
- **Warning**: Orange for pending items
- **Error**: Red for alerts and low stock
- **Info**: Purple and indigo for neutral metrics

### Responsive Design
- Mobile-first approach with responsive grids
- Collapsible layouts for smaller screens
- Touch-friendly button sizes

### Visual Elements
- Gradient backgrounds for visual appeal
- Shadow effects for depth
- Smooth animations and transitions
- Icon-based navigation for clarity

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Filtering**: Search and filter capabilities
3. **Export Functionality**: CSV/PDF export of data
4. **User Permissions**: Role-based access control
5. **Audit Logs**: Track all admin actions
6. **Bulk Operations**: Mass edit/delete capabilities

### Performance Optimizations
1. **Data Caching**: Implement React Query for better caching
2. **Pagination**: Handle large datasets efficiently
3. **Lazy Loading**: Load components on demand
4. **Optimistic Updates**: Immediate UI feedback

## Troubleshooting

### Common Issues
1. **API Connection Errors**: Check backend URL and network connectivity
2. **Data Not Loading**: Verify API endpoints are accessible
3. **Permission Errors**: Ensure proper authentication
4. **UI Rendering Issues**: Check browser console for errors

### Debug Mode
Enable debug logging by checking the browser console for detailed error messages and API response data.

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team. 