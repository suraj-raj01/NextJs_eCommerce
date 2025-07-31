import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Permissions
  const permView = await prisma.permission.create({
    data: { id: 'perm_view_products', name: 'View Products', description: 'Can view products' },
  })
  const permEdit = await prisma.permission.create({
    data: { id: 'perm_edit_products', name: 'Edit Products', description: 'Can edit products' },
  })
  const permOrder = await prisma.permission.create({
    data: { id: 'perm_manage_orders', name: 'Manage Orders', description: 'Can manage orders' },
  })

  // Roles
  const adminRole = await prisma.role.create({
    data: {
      id: 'role_admin',
      name: 'Admin',
      permissions: {
        connect: [{ id: permView.id }, { id: permEdit.id }, { id: permOrder.id }],
      },
    },
  })

  const customerRole = await prisma.role.create({
    data: {
      id: 'role_customer',
      name: 'Customer',
      permissions: {
        connect: [{ id: permView.id }],
      },
    },
  })

  // Users
  const adminUser = await prisma.user.create({
    data: {
      id: 'user_admin',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password',
      roles: { connect: [{ id: adminRole.id }] },
    },
  })

  const customerUser = await prisma.user.create({
    data: {
      id: 'user_customer',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
      roles: { connect: [{ id: customerRole.id }] },
    },
  })

  // Tax Rule
  await prisma.taxRule.create({
    data: {
      country: 'India',
      state: 'Delhi',
      type: 'GST',
      rate: 18.0,
    },
  })

  // Product
  const product = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      category: 'Electronics',
      description: 'High precision wireless mouse',
      price: 1200,
      stock: 50,
      userId: adminUser.id,
      images: ['mouse1.jpg', 'mouse2.jpg'],
      defaultImage: 'mouse1.jpg',
      colors: ['Black', 'Grey'],
    },
  })

  // Customer
  const customer = await prisma.customer.create({
    data: {
      id: 'cust_001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Street Name',
      state: 'Delhi',
      city: 'New Delhi',
      password: 'hashed_password',
    },
  })

  // Order
  const order = await prisma.order.create({
    data: {
      id: 'order_001',
      netTotal: 1200,
      tax: 216,
      subTotal: 1000,
      discount: 0,
      status: 'Processing',
      customerId: customer.id,
      confirmed: true,
    },
  })

  // Order Item
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product.id,
      quantity: 1,
      price: 1200,
    },
  })

  // Review
  await prisma.reviews.create({
    data: {
      productId: product.id,
      customerId: customer.id,
      rating: 5,
      comment: 'Excellent product!',
    },
  })

  // Complaint
  await prisma.complaint.create({
    data: {
      orderId: order.id,
      customerId: customer.id,
      complaint: 'Received wrong item',
      status: 'Pending',
    },
  })

  // Invoice
  await prisma.invoice.create({
    data: {
      products: [product.id],
      amount: 1200,
      currency: 'INR',
      isPaid: false,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      customerId: customer.id,
      orderId: order.id,
    },
  })

  // Coupon
  await prisma.coupon.create({
    data: {
      code: 'NEWUSER10',
      description: '10% off for new users',
      discount: 10,
      isActive: true,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  })

  // Plans
  await prisma.plans.create({
    data: {
      logo: 'premium-logo.png',
      title: 'Premium Plan',
      subtitle: 'Access all features',
      price: 999,
      plantype: 30,
      bilingcycle: 'monthly',
      description: 'Best for professionals',
      features: ['Unlimited access', 'Priority support'],
      button: 'Subscribe Now',
    },
  })

  // Plantype & Billingcycle
  await prisma.plantype.create({
    data: {
      type: 30,
    },
  })

  await prisma.billingcycle.create({
    data: {
      type: 'monthly',
    },
  })

  // Sitesetting
  await prisma.sitesetting.create({
    data: {
      companylogo: 'logo.png',
      menutitles: ['Home', 'Products', 'Contact'],
      addtocarticon: 'cart.png',
      favouriteicon: 'heart.png',
      loginicon: 'login.png',

      heroimg: 'hero.jpg',
      herotitle: 'Welcome to Our Store',
      herodescription: 'Explore our latest products',
      heroimages: ['hero1.jpg', 'hero2.jpg'],
      explorebtn: 'Shop Now',
      explorebtnlink: '/shop',

      companypartnertitle: 'Our Partners',
      companypartners: ['Company A', 'Company B'],

      featuretitle: 'Why Choose Us?',
      featuredescription: 'We offer the best quality',

      quicklinktitle: 'Quick Links',
      quicklinks: ['Privacy Policy', 'Terms of Service'],
      addresstitle: 'Contact Us',
      address: '123 Market Road',
      contact: '9876543210',
      email: 'support@example.com',
      sociallinks: ['facebook.com', 'instagram.com'],

      copyright: '© 2025',
      maintenance: false,
    },
  })
}

main()
  .then(() => {
    console.log('✅ Seed data created successfully.')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
