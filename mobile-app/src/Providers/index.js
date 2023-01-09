import React from 'react';
import AppProvider from './AppProvider';
import TransportProvider from './TransportProvider';
import AuthProvider from './AuthProvider';
import StorageProvider from './StorageProvider';
import TribeProvider from './TribeProvider';
import UserProvider from './UserProvider';
import DepartmentProvider from './DepartmentProvider';
import PrizeProvider from './PrizeProvider';
import CompanyProvider from './CompanyProvider';
import EventProvider from './EventProvider';
import { GOOGLE_MAPS_APIKEY, apikey } from "@env"

export const STATUSES = {
  loading: 'loading',
  error: 'error'
}

const axios = require('axios').default;

export const HereApi = axios.create({
  params: { apikey },
  headers: { 'Content-Type': 'application/json' }
});

export const GoogleMapsApi = axios.create({
  params: { key: GOOGLE_MAPS_APIKEY }
});

export const API = axios.create({
  headers: { 'Content-Type': 'application/json' }
})

const Providers = ({ children }) => {
  return (
    <AppProvider>
      <UserProvider>
        <AuthProvider>
          <EventProvider>
            <StorageProvider>
              <TransportProvider>
                <CompanyProvider>
                  <DepartmentProvider>
                    <TribeProvider>
                      <PrizeProvider>
                        {children}
                      </PrizeProvider>
                    </TribeProvider>
                  </DepartmentProvider>
                </CompanyProvider>
              </TransportProvider>
            </StorageProvider>
          </EventProvider>
        </AuthProvider>
      </UserProvider>
    </AppProvider>
  );
};

export default Providers;
