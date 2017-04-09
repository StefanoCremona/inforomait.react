import React, { Component } from 'react';
import { View, Text, WebView, NetInfo, TouchableHighlight, PermissionsAndroid } from 'react-native';

class App extends Component {

    constructor() {
        super();
        this.forceCheckTheConnectionAfterError = this.forceCheckTheConnectionAfterError.bind(this);
        this.checkTheConnection = this.checkTheConnection.bind(this);
        this.renderError = this.renderError.bind(this);
    }

    state = {
        connectionInfo: null,
        error: false
    }

    componentWillMount() {
        this.checkLocationPermission();
    }


    componentDidMount() {
        //Add a listener to manage the internet connection
        NetInfo.addEventListener('change', this.handleConnectionInfoChange); 
        this.checkTheConnection();
    }

    componentWillUnmount() {
        console.log('app.ComponentWillUnmount');
        NetInfo.removeEventListener('change', this.handleConnectionInfoChange); 
    }
    
    async checkLocationPermission() {
        try { 
            const granted = await 
            PermissionsAndroid.request( 
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
                { 
                    title: 'InfoRomaIt Location Permission', 
                    message: 'InfoRomaIt needs access to your gps so you can offer you a better service.'
                }
            );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) { 
                    console.log('You can use the camera');
                    this.setTheLocation();
                } else { 
                    console.log('Camera permission denied');
                }
            } 
        catch (err) {
            console.warn(err);
        }
    }

    setTheLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => { 
                const initialPosition = JSON.stringify(position);
                console.log(`Initial position: ${initialPosition}`); 
                this.setState({ initialPosition }); 
            }, 
            (error) => console.log(JSON.stringify(error)), 
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    handleConnectionInfoChange = (myConnectionInfo) => { 
        this.setState({ connectionInfo: myConnectionInfo });
        console.log(`Connection status is changed. Now is: ${myConnectionInfo}`);
    };

    checkTheConnection() {
        NetInfo.fetch().done((myConnectionInfo) => {
            console.log(`CheckTheConnection: ${myConnectionInfo}`);
            this.setState({ connectionInfo: myConnectionInfo }); 
        });
    }

    forceCheckTheConnectionAfterError() {
        console.log('forceCheckTheConnection');
        this.setState({ connectionInfo: 'NONE' });
        this.checkTheConnection();
    }

    renderError() {
        return (
            <View 
                style={{
                    flex: 1,
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: '#000000'
                }}
            ><Text
                style={{
                    color: '#ffffff',
                    marginBottom: 20
                }}
            >Connessione Non Disponibile</Text>
            <TouchableHighlight
                style={{
                    borderWidth: 1,
                    borderColor: '#ffffff',
                    borderRadius: 5,
                    width: 60,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => {
                    console.log('Press Button');
                    this.forceCheckTheConnectionAfterError();
                    }
                }
            >
                <Text
                    style={{
                        color: '#ffffff'
                    }}
                >Retry</Text>
            </TouchableHighlight>
            </View>
        );
    }

    render() {    
        if (this.state.connectionInfo !== null && 
            this.state.connectionInfo.toLowerCase() === 'none') {
            return (
                this.renderError()
            );
        }
    
        
        return (
            <View
                style={{
                    flex: 1
                }}
            >
            <WebView
                startInLoadingState
                renderError={this.renderError}
                source={{ uri: 'https://www.info.roma.it' }}
            />
            </View>
        );
    }
}

export default App;
