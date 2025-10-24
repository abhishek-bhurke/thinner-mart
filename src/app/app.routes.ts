import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home.component').then(mod => mod.HomeComponent) },
    { path: 'about-us', loadComponent: () => import('./components/about-us/about-us.component').then(mod => mod.AboutUsComponent) },
    { path: 'products', loadComponent: () => import('./components/products/products.component').then(mod => mod.ProductsComponent) },
    { path: 'privacy-policy', loadComponent: () => import('./components/privacy-policy/privacy-policy.component').then(mod => mod.PrivacyPolicyComponent) },
    { path: 'shipping-and-delivery-policy', loadComponent: () => import('./components/shipping-and-delivery-policy/shipping-and-delivery-policy.component').then(mod => mod.ShippingAndDeliveryPolicyComponent) },
    { path: 'refund-and-replacement-policy', loadComponent: () => import('./components/refund-and-replacement-policy/refund-and-replacement-policy.component').then(mod => mod.RefundAndReplacementPolicyComponent) },
    { path: 'terms-and-conditions', loadComponent: () => import('./components/terms-and-conditions/terms-and-conditions.component').then(mod => mod.TermsAndConditionsComponent) },
    { path: 'contact-us', loadComponent: () => import('./components/contact-us/contact-us.component').then(mod => mod.ContactUsComponent) },
    { path: 'product', loadComponent: () => import('./components/product/product.component').then(mod => mod.ProductComponent) },
    { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(mod => mod.CartComponent) },
    { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(mod => mod.CheckoutComponent), canActivate: [authGuard] },
    { path: 'orders', loadComponent: () => import('./components/orders/orders.component').then(mod => mod.OrdersComponent), canActivate: [authGuard] },
    { path: 'order-details', loadComponent: () => import('./components/orders/order-details/order-details.component').then(mod => mod.OrderDetailsComponent), canActivate: [authGuard] },
    { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(mod => mod.AdminComponent), canActivate: [adminGuard] },
    { path: 'product-list', loadComponent: () => import('./components/product-list/product-list.component').then(mod => mod.ProductListComponent), canActivate: [adminGuard] },
    { path: 'customer-list', loadComponent: () => import('./components/customer-list/customer-list.component').then(mod => mod.CustomerListComponent), canActivate: [adminGuard] },
    { path: 'coupons-list', loadComponent: () => import('./components/coupons-list/coupons-list.component').then(mod => mod.CouponsListComponent), canActivate: [adminGuard] },
    { path: 'add-edit-product', loadComponent: () => import('./components/add-edit-product/add-edit-product.component').then(mod => mod.AddEditProductComponent), canActivate: [adminGuard] },
    { path: 'add-edit-coupon', loadComponent: () => import('./components/add-edit-coupon/add-edit-coupon.component').then(mod => mod.AddEditCouponComponent), canActivate: [adminGuard] },
    { path: 'invoice', loadComponent: () => import('./components/invoice/invoice.component').then(mod => mod.InvoiceComponent), canActivate: [adminGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
