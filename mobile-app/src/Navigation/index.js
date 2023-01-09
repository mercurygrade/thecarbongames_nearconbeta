import { TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';

export const navigationRef = React.createRef();

export const navigate = (routeName, params) => {
    navigationRef.current?.navigate(routeName, params);
};

export const openDrawer = () => {
    navigationRef.current?.openDrawer();
};

export const changeStack = stackName => {
    resetRoot(stackName);
};

const resetRoot = routeName => {
    navigationRef.current?.resetRoot({
        index: 0,
        routes: [{ name: routeName }],
    });
};

export const defaultScreenOptions = {
    headerStyle: {
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: 'black',
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: .2
    },
    headerTintColor: 'black',
    headerTitleStyle: { fontWeight: 'bold' },
    detachPreviousScreen: false,
    cardStyle: { backgroundColor: 'white' },
    ...TransitionPresets.SlideFromRightIOS,
};

//This object is not necessary for the navigation to work but it provides overview of the application structure for fresh eyes and also it provides type safety for the route names
export const ROUTES = {
    TABS: {
        TABS: 'tabs',
        TRIPS_STACK: {
            STACK : 'Trips stack',
            TRIPS : 'Trips'
        },
        CREDITS: 'Credits'
    }
}


