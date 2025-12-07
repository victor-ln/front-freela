// Configuração para controlar o uso de dados mockados
export const MOCK_CONFIG = {
  // Se true, usa serviços mockados. Se false, usa API real
  USE_MOCK: true,

  // Entidades que devem usar mock (quando USE_MOCK = true)
  MOCK_ENTITIES: {
    categories: true,
    templates: true,
    socialNetworkTypes: true,
    clients: true,
    services: true,
    proposals: true
  }
};
