export const Icon = {
  Default: {
    prototype: {
      _getIconUrl: jest.fn(),
    },
  },
};

export const divIcon = jest.fn((options: unknown) => ({
  options,
  _getIconUrl: jest.fn(),
}));

export const marker = jest.fn(() => ({
  addTo: jest.fn(),
  bindPopup: jest.fn(),
  openPopup: jest.fn(),
  closePopup: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  setLatLng: jest.fn(),
  remove: jest.fn(),
}));

export const map = jest.fn(() => ({
  setView: jest.fn(),
  flyTo: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  invalidateSize: jest.fn(),
}));

export default { Icon, divIcon, marker, map };
