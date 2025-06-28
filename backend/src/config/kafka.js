import { Kafka } from 'kafkajs';
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: 'portfolio-management',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'portfolio-group' });

const initKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    
    await consumer.subscribe({ topic: 'order-processing' });
    await consumer.subscribe({ topic: 'audit-events' });
    
    logger.info('Kafka initialized successfully');
  } catch (error) {
    logger.error('Kafka initialization error:', error);
    throw error;
  }
};

export { kafka, producer, consumer, initKafka };