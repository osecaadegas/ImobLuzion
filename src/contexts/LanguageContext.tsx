import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeStorage } from '../lib/storage';

export type Language = 'pt' | 'en';

interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    adminPanel: string;
    properties: string;
    profile: string;
    logout: string;
  };
  
  // Authentication
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    loginButton: string;
    registerButton: string;
    switchToRegister: string;
    switchToLogin: string;
    demoAccounts: string;
    adminDemo: string;
    userDemo: string;
    passwordsDontMatch: string;
    userExists: string;
    invalidCredentials: string;
    loginSuccess: string;
    registerSuccess: string;
  };
  
  // Property details
  property: {
    price: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    yearBuilt: string;
    location: string;
    description: string;
    features: string;
    agent: string;
    contact: string;
    phone: string;
    email: string;
    viewDetails: string;
    addToFavorites: string;
    removeFromFavorites: string;
    photos: string;
  };
  
  // Property types
  propertyTypes: {
    apartment: string;
    house: string;
    condo: string;
    villa: string;
    townhouse: string;
    studio: string;
    land: string;
    commercial: string;
  };
  
  // Property form
  form: {
    addProperty: string;
    editProperty: string;
    title: string;
    titlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    price: string;
    pricePlaceholder: string;
    type: string;
    selectType: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    areaPlaceholder: string;
    yearBuilt: string;
    yearBuiltPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    city: string;
    cityPlaceholder: string;
    state: string;
    statePlaceholder: string;
    zipCode: string;
    zipCodePlaceholder: string;
    country: string;
    countryPlaceholder: string;
    agentName: string;
    agentNamePlaceholder: string;
    agentPhone: string;
    agentPhonePlaceholder: string;
    agentEmail: string;
    agentEmailPlaceholder: string;
    features: string;
    featuresPlaceholder: string;
    images: string;
    imageUrl: string;
    imageUrlPlaceholder: string;
    uploadImage: string;
    addImageUrl: string;
    removeImage: string;
    uploadMethod: string;
    fileUpload: string;
    urlInput: string;
    chooseFiles: string;
    maxFileSize: string;
    allowedFormats: string;
    save: string;
    cancel: string;
    saving: string;
    required: string;
  };
  
  // Dashboard
  dashboard: {
    welcome: string;
    totalProperties: string;
    favoriteProperties: string;
    searchProperties: string;
    searchPlaceholder: string;
    filterByType: string;
    allTypes: string;
    sortBy: string;
    priceAsc: string;
    priceDesc: string;
    newest: string;
    oldest: string;
    noProperties: string;
    noFavorites: string;
    addFirstProperty: string;
  };
  
  // Admin panel
  admin: {
    adminPanel: string;
    statistics: string;
    propertyManagement: string;
    addNewProperty: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    deleteMessage: string;
    deleteButton: string;
    cancelButton: string;
    propertyDeleted: string;
    actions: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    yes: string;
    no: string;
    ok: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    language: string;
  };
}

const translations: Record<Language, Translations> = {
  pt: {
    nav: {
      dashboard: 'Painel',
      adminPanel: 'Painel Admin',
      properties: 'Propriedades',
      profile: 'Perfil',
      logout: 'Sair'
    },
    auth: {
      login: 'Entrar',
      register: 'Registar',
      email: 'Email',
      password: 'Palavra-passe',
      confirmPassword: 'Confirmar palavra-passe',
      loginButton: 'Entrar',
      registerButton: 'Registar',
      switchToRegister: 'Não tem conta? Registe-se',
      switchToLogin: 'Já tem conta? Entre',
      demoAccounts: 'Contas de demonstração',
      adminDemo: 'Admin Demo',
      userDemo: 'Utilizador Demo',
      passwordsDontMatch: 'As palavras-passe não coincidem',
      userExists: 'Utilizador já existe',
      invalidCredentials: 'Credenciais inválidas',
      loginSuccess: 'Login efetuado com sucesso',
      registerSuccess: 'Registo efetuado com sucesso'
    },
    property: {
      price: 'Preço',
      type: 'Tipo',
      bedrooms: 'Quartos',
      bathrooms: 'Casas de banho',
      area: 'Área',
      yearBuilt: 'Ano de construção',
      location: 'Localização',
      description: 'Descrição',
      features: 'Características',
      agent: 'Agente',
      contact: 'Contacto',
      phone: 'Telefone',
      email: 'Email',
      viewDetails: 'Ver detalhes',
      addToFavorites: 'Adicionar aos favoritos',
      removeFromFavorites: 'Remover dos favoritos',
      photos: 'Fotografias'
    },
    propertyTypes: {
      apartment: 'Apartamento',
      house: 'Casa',
      condo: 'Condomínio',
      villa: 'Moradia',
      townhouse: 'Casa geminada',
      studio: 'Estúdio',
      land: 'Terreno',
      commercial: 'Comercial'
    },
    form: {
      addProperty: 'Adicionar Propriedade',
      editProperty: 'Editar Propriedade',
      title: 'Título',
      titlePlaceholder: 'Ex: Apartamento T2 no centro da cidade',
      description: 'Descrição',
      descriptionPlaceholder: 'Descreva a propriedade...',
      price: 'Preço',
      pricePlaceholder: 'Ex: 250000',
      type: 'Tipo de propriedade',
      selectType: 'Selecione um tipo',
      bedrooms: 'Quartos',
      bathrooms: 'Casas de banho',
      area: 'Área',
      areaPlaceholder: 'Ex: 85',
      yearBuilt: 'Ano de construção',
      yearBuiltPlaceholder: 'Ex: 2020',
      address: 'Morada',
      addressPlaceholder: 'Ex: Rua das Flores, 123',
      city: 'Cidade',
      cityPlaceholder: 'Ex: Lisboa',
      state: 'Distrito',
      statePlaceholder: 'Ex: Lisboa',
      zipCode: 'Código postal',
      zipCodePlaceholder: 'Ex: 1000-100',
      country: 'País',
      countryPlaceholder: 'Ex: Portugal',
      agentName: 'Nome do agente',
      agentNamePlaceholder: 'Ex: João Silva',
      agentPhone: 'Telefone do agente',
      agentPhonePlaceholder: 'Ex: +351 912 345 678',
      agentEmail: 'Email do agente',
      agentEmailPlaceholder: 'Ex: joao@imobiliaria.com',
      features: 'Características',
      featuresPlaceholder: 'Ex: Varanda, Garagem, Ar condicionado',
      images: 'Imagens',
      imageUrl: 'URL da imagem',
      imageUrlPlaceholder: 'Cole o link da imagem aqui',
      uploadImage: 'Carregar imagem',
      addImageUrl: 'Adicionar URL',
      removeImage: 'Remover imagem',
      uploadMethod: 'Método de carregamento',
      fileUpload: 'Carregar ficheiro',
      urlInput: 'URL da imagem',
      chooseFiles: 'Escolher ficheiros',
      maxFileSize: 'Tamanho máximo: 5MB',
      allowedFormats: 'Formatos: JPEG, PNG, WebP',
      save: 'Guardar',
      cancel: 'Cancelar',
      saving: 'A guardar...',
      required: 'obrigatório'
    },
    dashboard: {
      welcome: 'Bem-vindo',
      totalProperties: 'Total de propriedades',
      favoriteProperties: 'Propriedades favoritas',
      searchProperties: 'Pesquisar propriedades',
      searchPlaceholder: 'Pesquisar por título, localização...',
      filterByType: 'Filtrar por tipo',
      allTypes: 'Todos os tipos',
      sortBy: 'Ordenar por',
      priceAsc: 'Preço (menor para maior)',
      priceDesc: 'Preço (maior para menor)',
      newest: 'Mais recentes',
      oldest: 'Mais antigos',
      noProperties: 'Nenhuma propriedade encontrada',
      noFavorites: 'Ainda não tem propriedades favoritas',
      addFirstProperty: 'Adicione a sua primeira propriedade'
    },
    admin: {
      adminPanel: 'Painel de Administração',
      statistics: 'Estatísticas',
      propertyManagement: 'Gestão de Propriedades',
      addNewProperty: 'Adicionar Nova Propriedade',
      edit: 'Editar',
      delete: 'Eliminar',
      confirmDelete: 'Confirmar eliminação',
      deleteMessage: 'Tem a certeza de que deseja eliminar esta propriedade? Esta ação não pode ser desfeita.',
      deleteButton: 'Eliminar',
      cancelButton: 'Cancelar',
      propertyDeleted: 'Propriedade eliminada com sucesso',
      actions: 'Ações'
    },
    common: {
      loading: 'A carregar...',
      error: 'Erro',
      success: 'Sucesso',
      yes: 'Sim',
      no: 'Não',
      ok: 'OK',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Adicionar',
      remove: 'Remover',
      close: 'Fechar',
      back: 'Voltar',
      next: 'Seguinte',
      previous: 'Anterior',
      search: 'Pesquisar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      language: 'Idioma'
    }
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      adminPanel: 'Admin Panel',
      properties: 'Properties',
      profile: 'Profile',
      logout: 'Logout'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Login',
      demoAccounts: 'Demo Accounts',
      adminDemo: 'Admin Demo',
      userDemo: 'User Demo',
      passwordsDontMatch: "Passwords don't match",
      userExists: 'User already exists',
      invalidCredentials: 'Invalid credentials',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful'
    },
    property: {
      price: 'Price',
      type: 'Type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      yearBuilt: 'Year Built',
      location: 'Location',
      description: 'Description',
      features: 'Features',
      agent: 'Agent',
      contact: 'Contact',
      phone: 'Phone',
      email: 'Email',
      viewDetails: 'View Details',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      photos: 'Photos'
    },
    propertyTypes: {
      apartment: 'Apartment',
      house: 'House',
      condo: 'Condo',
      villa: 'Villa',
      townhouse: 'Townhouse',
      studio: 'Studio',
      land: 'Land',
      commercial: 'Commercial'
    },
    form: {
      addProperty: 'Add Property',
      editProperty: 'Edit Property',
      title: 'Title',
      titlePlaceholder: 'e.g., Beautiful 2BR apartment in city center',
      description: 'Description',
      descriptionPlaceholder: 'Describe the property...',
      price: 'Price',
      pricePlaceholder: 'e.g., 250000',
      type: 'Property Type',
      selectType: 'Select a type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      areaPlaceholder: 'e.g., 85',
      yearBuilt: 'Year Built',
      yearBuiltPlaceholder: 'e.g., 2020',
      address: 'Address',
      addressPlaceholder: 'e.g., 123 Main Street',
      city: 'City',
      cityPlaceholder: 'e.g., Lisbon',
      state: 'State/District',
      statePlaceholder: 'e.g., Lisbon',
      zipCode: 'Zip Code',
      zipCodePlaceholder: 'e.g., 1000-100',
      country: 'Country',
      countryPlaceholder: 'e.g., Portugal',
      agentName: 'Agent Name',
      agentNamePlaceholder: 'e.g., John Smith',
      agentPhone: 'Agent Phone',
      agentPhonePlaceholder: 'e.g., +351 912 345 678',
      agentEmail: 'Agent Email',
      agentEmailPlaceholder: 'e.g., john@realestate.com',
      features: 'Features',
      featuresPlaceholder: 'e.g., Balcony, Garage, Air conditioning',
      images: 'Images',
      imageUrl: 'Image URL',
      imageUrlPlaceholder: 'Paste image link here',
      uploadImage: 'Upload Image',
      addImageUrl: 'Add URL',
      removeImage: 'Remove Image',
      uploadMethod: 'Upload Method',
      fileUpload: 'File Upload',
      urlInput: 'Image URL',
      chooseFiles: 'Choose Files',
      maxFileSize: 'Max size: 5MB',
      allowedFormats: 'Formats: JPEG, PNG, WebP',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      required: 'required'
    },
    dashboard: {
      welcome: 'Welcome',
      totalProperties: 'Total Properties',
      favoriteProperties: 'Favorite Properties',
      searchProperties: 'Search Properties',
      searchPlaceholder: 'Search by title, location...',
      filterByType: 'Filter by Type',
      allTypes: 'All Types',
      sortBy: 'Sort By',
      priceAsc: 'Price (Low to High)',
      priceDesc: 'Price (High to Low)',
      newest: 'Newest First',
      oldest: 'Oldest First',
      noProperties: 'No properties found',
      noFavorites: 'You have no favorite properties yet',
      addFirstProperty: 'Add your first property'
    },
    admin: {
      adminPanel: 'Admin Panel',
      statistics: 'Statistics',
      propertyManagement: 'Property Management',
      addNewProperty: 'Add New Property',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Confirm Delete',
      deleteMessage: 'Are you sure you want to delete this property? This action cannot be undone.',
      deleteButton: 'Delete',
      cancelButton: 'Cancel',
      propertyDeleted: 'Property deleted successfully',
      actions: 'Actions'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = SafeStorage.getItemWithMemoryFallback('language');
    return (saved as Language) || 'pt'; // Default to Portuguese
  });

  useEffect(() => {
    SafeStorage.setItemWithMemoryFallback('language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};