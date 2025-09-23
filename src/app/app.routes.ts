import { Routes } from '@angular/router';

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
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
