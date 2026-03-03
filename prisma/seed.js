const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
    console.log('Starting seed...');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set in environment or .env.local');
    }

    const prisma = new PrismaClient({
        datasourceUrl: connectionString
    });
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Admin User',
        },
    });
    console.log(`Admin user ensured: ${admin.email}`);

    // Seed sample projects
    const projects = [
        {
            title: 'Neural Engine Optimizer',
            description: 'A cutting edge AI model that optimizes neural networks for edge devices. Increases efficiency by 40% with no loss in accuracy. Built with Python, TensorRT, and edge-first philosophies.',
            image: '/projects/neural.jpg',
            tags: ['Python', 'TensorFlow', 'CUDA'],
            order: 1
        },
        {
            title: 'Quantum Key Distribution App',
            description: 'An application built on advanced cryptography principles to simulate and demonstrate secure key exchange using quantum entanglement modeling.',
            image: '/projects/quantum.jpg',
            tags: ['Next.js', 'WebCrypto', 'Rust'],
            order: 2
        },
        {
            title: 'Holographic Display UI',
            description: 'Interface design and implementation for next-generation spatial computing platforms. Focuses on intuitive gesture control and volumetric data visualization.',
            image: '/projects/hologram.jpg',
            tags: ['Three.js', 'React', 'WebGL'],
            order: 3
        }
    ];

    for (const project of projects) {
        const p = await prisma.project.create({ data: project });
        console.log(`Created project: ${p.title}`);
    }

    // Seed experience
    const experiences = [
        {
            role: 'Senior AI Engineer',
            company: 'Cognitive Computing Inc.',
            duration: '2023 - Present',
            description: 'Leading a team of engineers to develop proprietary natural language models for internal enterprise tools. Reduced processing latency by over 60%.',
            order: 1
        },
        {
            role: 'Frontend Developer',
            company: 'Web3 Innovators',
            duration: '2021 - 2023',
            description: 'Maintained and scaled decentralized applications. Designed complex UI components with React and WebGL for interactive data dashboards.',
            order: 2
        }
    ];

    for (const exp of experiences) {
        await prisma.experience.create({ data: exp });
        console.log(`Created experience: ${exp.role}`);
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        console.log('Finished');
        process.exit(0);
    });
