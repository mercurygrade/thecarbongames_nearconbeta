import React, { useContext } from "react"
import { ActivityIndicator, Modal, Text, View } from "react-native"
import { AppContext } from "../Providers/AppProvider"
import Colors from "./Colors"


export default LoadingModal = () => {
    const { loading } = useContext(AppContext)

    if(!loading) return null
  
    return (
      <View >
        <Modal
          visible={!!loading}
          transparent={true}
          hardwareAccelerated
          statusBarTranslucent
          animationType="fade">
          <View style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE, borderRadius: 15, padding: 20 }}>
              <ActivityIndicator color={Colors.PRIMARY} size="large" style={{ paddingRight: 10 }} />
              <Text style={{ fontSize: 16, color : Colors.BLACK_100 }} >{typeof loading=='string' ? loading : 'Loading'}</Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
  