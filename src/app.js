import React, { Component } from 'react';
import { View, Text, WebView, NetInfo, TouchableHighlight } from 'react-native';

class App extends Component {

    state = {
        connectionInfo: null
    }

    componentDidMount() {
        //Add a listener to manage the internet connection
        NetInfo.addEventListener('change', this.handleConnectionInfoChange); 
        NetInfo.fetch().done((myConnectionInfo) => { 
            this.setState({ connectionInfo: myConnectionInfo }); 
        });
    }

    componentWillUnmount() {
        console.log('app.ComponentWillUnmount');
        NetInfo.removeEventListener('change', this.handleConnectionInfoChange); 
    }
    
    handleConnectionInfoChange = (myConnectionInfo) => { 
        this.setState({ connectionInfo: myConnectionInfo });
        console.log(`Connection status is changed. Now is: ${myConnectionInfo}`);
    };

    checkTheConnection() {
        NetInfo.fetch().done((myConnectionInfo) => { 
            this.setState({ connectionInfo: myConnectionInfo }); 
        });
    }

    render() {
        if (this.state.connectionInfo === 'none') {
            return (
                <View 
                    style={{
                        flex: 1,
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column' }}
                ><Text>Connessione Non Disponibile</Text>
                <TouchableHighlight 
                    onPress={this.checkTheConnection.bind(this)}
                >
                    <Text>Retry</Text>
                </TouchableHighlight>
                </View>
            );
        }
        return (
            <View
                style={{
                    flex: 1
                }}
            >
            <WebView 
                source={{ uri: 'https://www.info.roma.it' }}
            />
            </View>
        );
    }
}

export default App;
