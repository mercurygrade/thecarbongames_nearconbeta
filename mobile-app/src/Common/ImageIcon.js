import React, { useMemo } from "react";
import { Image, View } from "react-native";

export default ImageIcon = ({ size = 27, containerStyle, iconStyle, name, color }) => {

    const image = useMemo(() => {
        switch (name) {
            case 'carbon': return require('../Assets/carbon_icon.png')
            case 'edit': return require('../Assets/edit.png')
            case 'info-outlined': return require('../Assets/icon_u_info_circle.png')
            case 'users': return require('../Assets/icon_u_users_alt.png')
            case 'directions': return require('../Assets/icon_u_directions.png')
            case 'shield': return require('../Assets/icon_u_shield_check.png')
            case 'shopping': return require('../Assets/icon_fi_shopping_bag.png')
            case 'car': return require('../Assets/icon_u_car.png')
            case 'graph': return require('../Assets/icon_u_graph_bar.png')
            case 'bike': return require('../Assets/icon_bike.png')
            case 'bolt': return require('../Assets/icon_bi_lightning_charge.png')
            case 'history': return require('../Assets/icon_u_history.png')
            case 'qr-code': return require('../Assets/icon_u_qrcode_scan.png')
            case 'directions-boat': return require('../Assets/directions_boat.png')
            case 'directions-bus': return require('../Assets/directions_bus.png')
            case 'directions-car': return require('../Assets/directions_car.png')
            case 'directions-railway': return require('../Assets/directions_railway.png')
            case 'directions-run': return require('../Assets/directions_run.png')
            case 'directions-subway': return require('../Assets/directions_subway.png')
            case 'directions-walk': return require('../Assets/directions_walk.png')
            case 'electric-bike': return require('../Assets/electric_bike.png')
            case 'electric-car': return require('../Assets/electric_car.png')
            case 'electric-moped': return require('../Assets/electric_moped.png')
            case 'electric-rickshaw': return require('../Assets/electric_rickshaw.png')
            case 'electric-scooter': return require('../Assets/electric_scooter.png')
            case 'flight': return require('../Assets/flight.png')
            case 'helicopter': return require('../Assets/helicopter.png')
            case 'local-taxi': return require('../Assets/local_taxi.png')
            case 'maps-home-work': return require('../Assets/maps_home_work.png')
            case 'moped': return require('../Assets/moped.png')
            case 'pedal-bike': return require('../Assets/pedal_bike.png')
            case 'rickshaw': return require('../Assets/rickshaw.png')
            case 'sailing': return require('../Assets/sailing.png')
            case 'scooter': return require('../Assets/scooter.png')
            case 'skateboarding': return require('../Assets/skateboarding.png')
            case 'snowmobile': return require('../Assets/snowmobile.png')
            case 'subway': return require('../Assets/subway.png')
            case 'tram': return require('../Assets/tram.png')
            case 'two-wheeler': return require('../Assets/two_wheeler.png')
            case 'maps-home': return require('../Assets/maps_home.png')
            case 'aim' : return require('../Assets/aim.png')
            default:
                break;
        }
    }, [name])

    return (
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, containerStyle]} >
            <Image style={[{ width: size, height: size, resizeMode: 'contain', tintColor: color }, iconStyle]} source={image} />
        </View>
    )
}