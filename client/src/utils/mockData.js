// Premium mock database seeds for AharSetu

export const seedMockDatabase = () => {
  if (localStorage.getItem('aharsetu_seeded')) return;

  const mockUsers = [
    {
      id: 'usr_admin',
      name: 'Aditya Sharma',
      email: 'admin@aharsetu.org',
      password: 'password123',
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'AharSetu Central HQ, Connaught Place, New Delhi',
      coordinates: { lat: 28.6289, lng: 77.2150 }
    },
    {
      id: 'usr_donor1',
      name: 'Taj Palace Culinary Kitchen',
      email: 'donor@taj.com',
      password: 'password123',
      role: 'donor',
      phone: '+91 88888 77777',
      address: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
      coordinates: { lat: 28.5990, lng: 77.1780 },
      donorDetails: { donorType: 'hotel' }
    },
    {
      id: 'usr_donor2',
      name: 'The Organic Gourmet Bistro',
      email: 'bistro@organic.com',
      password: 'password123',
      role: 'donor',
      phone: '+91 99999 88888',
      address: 'Khan Market, Rabindra Nagar, New Delhi',
      coordinates: { lat: 28.6002, lng: 77.2272 },
      donorDetails: { donorType: 'restaurant' }
    },
    {
      id: 'usr_receiver1',
      name: 'Hope Foundation Shelter',
      email: 'receiver@hope.org',
      password: 'password123',
      role: 'receiver',
      phone: '+91 77777 66666',
      address: 'Sewa Kutir Complex, Kingsway Camp, Delhi',
      coordinates: { lat: 28.6948, lng: 77.2085 },
      receiverDetails: { organizationName: 'Hope Foundation NGO', beneficiariesCount: 150 }
    },
    {
      id: 'usr_receiver2',
      name: 'Nanhi Jaan Child Welfare',
      email: 'nanhi@childcare.org',
      password: 'password123',
      role: 'receiver',
      phone: '+91 66666 55555',
      address: 'Lajpat Nagar IV, New Delhi',
      coordinates: { lat: 28.5682, lng: 77.2435 },
      receiverDetails: { organizationName: 'Nanhi Jaan Welfare', beneficiariesCount: 85 }
    },
    {
      id: 'usr_volunteer1',
      name: 'Kabir Mehta',
      email: 'volunteer@gmail.com',
      password: 'password123',
      role: 'volunteer',
      phone: '+91 95555 44444',
      address: 'M-Block, Greater Kailash II, New Delhi',
      coordinates: { lat: 28.5320, lng: 77.2480 },
      volunteerDetails: {
        experience: '3 years in community food drives. Dedicated to local distribution.',
        idProofUrl: 'verified_id.png',
        availability: ['Weekend Morning', 'Weekday Evening'],
        serviceArea: 'South Delhi Range',
        isVerified: true
      }
    },
    {
      id: 'usr_volunteer2',
      name: 'Riya Sen',
      email: 'riya@volunteer.org',
      password: 'password123',
      role: 'volunteer',
      phone: '+91 94444 33333',
      address: 'Karol Bagh, New Delhi',
      coordinates: { lat: 28.6442, lng: 77.1878 },
      volunteerDetails: {
        experience: 'New volunteer eager to optimize recovery logistics and map routes.',
        idProofUrl: 'verified_id_2.png',
        availability: ['Flexible Hours'],
        serviceArea: 'Central Delhi',
        isVerified: true
      }
    }
  ];

  const now = new Date();
  
  const mockDonations = [
    {
      id: 'don_01',
      donorId: 'usr_donor1',
      donorName: 'Taj Palace Culinary Kitchen',
      donorPhone: '+91 88888 77777',
      foodName: 'Premium Basmati Rice & Mixed Vegetable Korma',
      foodType: 'Veg',
      quantity: '60 Meals',
      prepTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
      expiryTime: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(), // 6 hrs from now
      pickupAddress: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
      coordinates: { lat: 28.5990, lng: 77.1780 },
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
      additionalNotes: 'Freshly cooked for a seminar that finished early. Packed in standard insulated containers.',
      status: 'available',
      claimedByReceiverId: null,
      assignedVolunteerId: null,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_02',
      donorId: 'usr_donor2',
      donorName: 'The Organic Gourmet Bistro',
      donorPhone: '+91 99999 88888',
      foodName: 'Fresh Baked Sourdough & Roasted Tomato Pastas',
      foodType: 'Vegan',
      quantity: '25 Servings',
      prepTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      expiryTime: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      pickupAddress: 'Khan Market, Rabindra Nagar, New Delhi',
      coordinates: { lat: 28.6002, lng: 77.2272 },
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
      additionalNotes: 'Pasta dishes have olive-oil dressing. Packed into bio-degradable meal bowls.',
      status: 'claimed',
      claimedByReceiverId: 'usr_receiver1',
      assignedVolunteerId: 'usr_volunteer1',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_03',
      donorId: 'usr_donor1',
      donorName: 'Taj Palace Culinary Kitchen',
      donorPhone: '+91 88888 77777',
      foodName: 'Chicken Biryani & Mint Raita Buffet Surplus',
      foodType: 'Non-Veg',
      quantity: '80 Meals',
      prepTime: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      expiryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Expired
      pickupAddress: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
      coordinates: { lat: 28.5990, lng: 77.1780 },
      imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop',
      additionalNotes: 'High-quality spice ingredients. Needs refrigeration.',
      status: 'delivered',
      claimedByReceiverId: 'usr_receiver2',
      assignedVolunteerId: 'usr_volunteer2',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockRequests = [
    {
      id: 'req_01',
      receiverId: 'usr_receiver1',
      organizationName: 'Hope Foundation NGO',
      contactPerson: 'Sister Evelyn',
      phone: '+91 77777 66666',
      foodRequirement: 'Prepared meals for elderly shelter residents.',
      quantityNeeded: '100 Meals',
      beneficiaries: 120,
      deliveryAddress: 'Sewa Kutir Complex, Kingsway Camp, Delhi',
      coordinates: { lat: 28.6948, lng: 77.2085 },
      emergencyLevel: 'High',
      status: 'pending',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'req_02',
      receiverId: 'usr_receiver2',
      organizationName: 'Nanhi Jaan Welfare',
      contactPerson: 'Dr. Vivek Dev',
      phone: '+91 66666 55555',
      foodRequirement: 'Nutritious milk, fresh bread, and child-safe snacks.',
      quantityNeeded: '40 Bundles',
      beneficiaries: 55,
      deliveryAddress: 'Lajpat Nagar IV, New Delhi',
      coordinates: { lat: 28.5682, lng: 77.2435 },
      emergencyLevel: 'Critical',
      status: 'assigned',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockNotifications = [
    {
      id: 'not_01',
      userId: 'usr_donor1',
      title: 'Donation Completed!',
      message: 'Your surplus Chicken Biryani (80 Meals) has been delivered successfully to Nanhi Jaan Welfare. Thank you for your impact!',
      type: 'success',
      isRead: false,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'not_02',
      userId: 'usr_receiver1',
      title: 'Volunteer Dispatched',
      message: 'Volunteer Kabir Mehta has claimed your delivery and is arriving with the Organic Bistro Pasta.',
      type: 'info',
      isRead: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'not_03',
      userId: 'usr_admin',
      title: 'New Donor Registered',
      message: 'Taj Palace Culinary Kitchen has joined the AharSetu platform and is ready to list donations.',
      type: 'alert',
      isRead: true,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockFeedback = [
    {
      id: 'fb_01',
      name: 'Chef Rajesh Khanna',
      email: 'rajesh@tajpalace.com',
      message: 'AharSetu has completely transformed how we handle corporate buffet overflows. Instead of disposal, we safely and quickly share meals with nearby children. High fidelity tracking!',
      rating: 5,
      isTestimonial: true,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'fb_02',
      name: 'Sister Evelyn',
      email: 'evelyn@hope.org',
      message: 'NGO operations require predictability. Through the volunteer network of AharSetu, we receive critical nutritious bread and dairy drops in under an hour from donor submission.',
      rating: 5,
      isTestimonial: true,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'fb_03',
      name: 'Ramanathan Iyer',
      email: 'raman@volunteer.in',
      message: 'Highly satisfying application dashboard! The interactive routes coordinate beautifully with my two-wheeler navigation. Fighting food waste is easy!',
      rating: 4,
      isTestimonial: true,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  localStorage.setItem('aharsetu_users', JSON.stringify(mockUsers));
  localStorage.setItem('aharsetu_donations', JSON.stringify(mockDonations));
  localStorage.setItem('aharsetu_requests', JSON.stringify(mockRequests));
  localStorage.setItem('aharsetu_notifications', JSON.stringify(mockNotifications));
  localStorage.setItem('aharsetu_feedback', JSON.stringify(mockFeedback));
  localStorage.setItem('aharsetu_seeded', 'true');
};
