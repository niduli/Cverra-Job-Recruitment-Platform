import axios from 'axios';

const ML_ROLE_PREDICTION_URL = process.env.ML_ROLE_PREDICTION_URL || 'http://localhost:6000';
const ML_JOB_RECOMMEND_URL = process.env.ML_JOB_RECOMMEND_URL || 'http://localhost:5002';
const ML_CV_RANKING_URL = process.env.ML_CV_RANKING_URL || 'http://localhost:8002';

const TIMEOUT = 5000; // 5 seconds

/**
 * Check health of all ML services
 * @returns {Promise<Object>} Health status for each service
 */
export const checkMLServices = async () => {
  const services = {
    rolePrediction: {
      url: `${ML_ROLE_PREDICTION_URL}/health`,
      name: 'Role Prediction Service',
      port: 6000,
      status: 'unknown'
    },
    jobRecommendation: {
      url: `${ML_JOB_RECOMMEND_URL}/health`,
      name: 'Job Recommendation Service',
      port: 5002,
      status: 'unknown'
    },
    cvRanking: {
      url: `${ML_CV_RANKING_URL}/health`,
      name: 'CV Ranking Service',
      port: 8002,
      status: 'unknown'
    }
  };

  const health = {
    timestamp: new Date().toISOString(),
    allHealthy: true,
    services: {}
  };

  // Check each service in parallel
  const checks = Object.entries(services).map(async ([key, service]) => {
    try {
      const response = await axios.get(service.url, { timeout: TIMEOUT });
      health.services[key] = {
        name: service.name,
        port: service.port,
        status: 'healthy',
        message: response.data?.message || 'Service is running'
      };
    } catch (error) {
      health.allHealthy = false;
      health.services[key] = {
        name: service.name,
        port: service.port,
        status: 'unhealthy',
        error: error.message,
        hint: `Make sure ${service.name} is running on port ${service.port}`
      };
    }
  });

  await Promise.all(checks);

  return health;
};

/**
 * Check if all critical ML services are healthy
 * Returns true only if all services are running
 * @returns {Promise<Boolean>}
 */
export const areMLServicesHealthy = async () => {
  try {
    const health = await checkMLServices();
    return health.allHealthy;
  } catch (error) {
    console.error('Error checking ML services health:', error.message);
    return false;
  }
};

/**
 * Middleware to check ML services before processing requests
 * Can be used optionally on routes that require ML services
 */
export const mlServiceHealthCheck = async (req, res, next) => {
  try {
    const health = await checkMLServices();
    
    if (!health.allHealthy) {
      const unhealthyServices = Object.entries(health.services)
        .filter(([_, service]) => service.status === 'unhealthy')
        .map(([_, service]) => `${service.name} (port ${service.port})`)
        .join(', ');
      
      return res.status(503).json({
        success: false,
        message: 'ML services unavailable',
        details: `The following services are not running: ${unhealthyServices}`,
        services: health.services
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking ML services',
      error: error.message
    });
  }
};

export default {
  checkMLServices,
  areMLServicesHealthy,
  mlServiceHealthCheck
};
