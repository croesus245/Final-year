import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from './src/models/Project.js';
import { Admin } from './src/models/Admin.js';
import { generateProjectId } from './src/utils/helpers.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/final-year-db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing)
    // await Project.deleteMany({});
    // await Admin.deleteMany({});
    // console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminExists = await Admin.findOne({ email: 'admin@university.edu' });
    if (!adminExists) {
      const admin = new Admin({
        email: 'admin@university.edu',
        passwordHash: 'Admin@123', // Will be hashed by pre-save hook
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Created admin user (email: admin@university.edu, password: Admin@123)');
    } else {
      console.log('⏭️ Admin user already exists');
    }

    // Sample projects data
    const sampleProjects = [
      {
        projectId: generateProjectId(),
        title: 'Advanced GIS Applications in Urban Planning and Land Management',
        author: 'Kofi Mensah',
        department: 'Surveying & Geoinformatics',
        year: 2024,
        abstract: 'This research explores the integration of advanced Geographic Information Systems (GIS) technologies with urban planning methodologies to enhance spatial decision-making. The study focuses on land use optimization, infrastructure planning, and sustainable development in rapidly urbanizing African cities. Using remote sensing data and spatial analysis, we developed a comprehensive framework for identifying optimal locations for public infrastructure including hospitals, schools, and transportation networks. The results demonstrate a 40% improvement in planning efficiency and 25% cost reduction in infrastructure development.',
        supervisor: 'Prof. Ama Asante',
        fileName: 'GIS_Urban_Planning_2024.pdf',
        fileSize: 2500000,
        filePath: './uploads/sample-1.pdf',
        status: 'approved',
        views: 145,
        downloads: 32,
        tags: ['GIS', 'Urban Planning', 'Remote Sensing', 'Infrastructure'],
      },
      {
        projectId: generateProjectId(),
        title: 'Drone Photogrammetry for High-Precision Terrain Mapping in Mountainous Regions',
        author: 'Yaw Owusu',
        department: 'Geoinformatics',
        year: 2024,
        abstract: 'This project investigates the application of unmanned aerial vehicles (UAVs) equipped with high-resolution cameras to generate accurate digital terrain models (DTMs) in challenging mountainous environments. We compared traditional surveying methods with drone-based photogrammetry across three pilot sites, achieving sub-meter accuracy at significantly reduced cost and time. The methodology incorporates Structure from Motion (SfM) algorithms and ground control point (GCP) verification. Results show 95.7% accuracy improvement over existing datasets and 80% time savings compared to traditional surveys. The research provides a scalable, cost-effective solution for terrain mapping in developing regions.',
        supervisor: 'Dr. Kwesi Boateng',
        fileName: 'Drone_Photogrammetry_2024.pdf',
        fileSize: 3200000,
        filePath: './uploads/sample-2.pdf',
        status: 'approved',
        views: 203,
        downloads: 58,
        tags: ['Photogrammetry', 'UAV', 'Terrain Mapping', 'Remote Sensing'],
      },
      {
        projectId: generateProjectId(),
        title: 'Machine Learning Classification of Satellite Imagery for Land Cover Mapping',
        author: 'Abena Boateng',
        department: 'Geoinformatics',
        year: 2023,
        abstract: 'This study applies machine learning algorithms including Random Forest, Support Vector Machine (SVM), and Convolutional Neural Networks (CNN) to classify satellite imagery for automated land cover mapping. Using Sentinel-2 multispectral data, we achieved 92.3% overall accuracy in distinguishing between urban areas, agricultural land, water bodies, and vegetation zones. The model was trained on 50,000 labeled pixels across multiple seasons to ensure temporal robustness. The research demonstrates the effectiveness of ensemble methods in handling multi-spectral classification tasks and provides a replicable framework for large-scale land cover monitoring in data-sparse regions.',
        supervisor: 'Prof. Benjamin Ansah',
        fileName: 'ML_Satellite_Classification_2023.pdf',
        fileSize: 2800000,
        filePath: './uploads/sample-3.pdf',
        status: 'approved',
        views: 178,
        downloads: 44,
        tags: ['Machine Learning', 'Satellite Imagery', 'Land Cover', 'Classification'],
      },
      {
        projectId: generateProjectId(),
        title: 'LiDAR-Based Building Height Estimation and 3D Urban Modeling',
        author: 'Nana Addison',
        department: 'Surveying',
        year: 2023,
        abstract: 'This research utilizes Light Detection and Ranging (LiDAR) point cloud data to automatically extract building heights and construct accurate 3D city models. The methodology combines automated building extraction algorithms with manual verification for quality assurance. We processed LiDAR data covering 150 square kilometers and generated a high-resolution 3D model with height accuracy of ±0.5 meters. The resulting dataset has applications in urban planning, disaster management, renewable energy assessment, and cellular network optimization. The study demonstrates LiDAR as a superior alternative to traditional surveying for large-scale urban mapping, with 60% cost reduction and 10x faster data acquisition.',
        supervisor: 'Dr. Osei Mensah',
        fileName: 'LiDAR_Building_Height_2023.pdf',
        fileSize: 3500000,
        filePath: './uploads/sample-4.pdf',
        status: 'approved',
        views: 256,
        downloads: 71,
        tags: ['LiDAR', '3D Modeling', 'Building Detection', 'Urban Mapping'],
      },
      {
        projectId: generateProjectId(),
        title: 'IoT-Based Environmental Monitoring System for Real-Time Geospatial Analysis',
        author: 'Kwame Amoako',
        department: 'Geoinformatics',
        year: 2024,
        abstract: 'This project develops an integrated IoT monitoring system that combines ground-based sensors with geospatial analysis techniques for real-time environmental monitoring. The system includes temperature, humidity, air quality, and water quality sensors distributed across a study area, transmitting data via LoRaWAN to a central cloud-based server. Spatial interpolation techniques (kriging, IDW) were applied to generate continuous environmental surfaces from discrete point measurements. The platform includes a web-based dashboard for real-time visualization and decision support. Results show the system can detect environmental anomalies within 2-minute windows and has been deployed in three pilot cities. This research showcases the convergence of IoT and GIS for smart city applications.',
        supervisor: 'Prof. Esi Owusu',
        fileName: 'IoT_Environmental_Monitoring_2024.pdf',
        fileSize: 2900000,
        filePath: './uploads/sample-5.pdf',
        status: 'approved',
        views: 189,
        downloads: 39,
        tags: ['IoT', 'Environmental Monitoring', 'Geospatial Analysis', 'Smart City'],
      },
    ];

    // Insert sample projects
    const existingCount = await Project.countDocuments({ status: 'approved' });
    if (existingCount === 0) {
      await Project.insertMany(sampleProjects);
      console.log(`✅ Inserted ${sampleProjects.length} sample projects`);
    } else {
      console.log(`⏭️ Projects already exist (${existingCount} approved projects found)`);
    }

    console.log('🌱 Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
