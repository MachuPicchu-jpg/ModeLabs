import prisma from './prisma';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // 测试创建一条记录
    const model = await prisma.model.create({
      data: {
        name: 'Test Model',
        type: 'text',
        version: '1.0',
        provider: 'OpenAI',
        description: 'Test description'
      }
    });
    
    console.log('Created test model:', model);
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();