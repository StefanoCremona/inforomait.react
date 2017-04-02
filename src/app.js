import React, { Component } from 'react';
import { View, Text, WebView, NetInfo, TouchableHighlight } from 'react-native';

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

    componentDidMount() {
        //Add a listener to manage the internet connection
        NetInfo.addEventListener('change', this.handleConnectionInfoChange); 
        this.checkTheConnection();
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
                    flexDirection: 'column'
                }}
            ><Text>Connessione Non Disponibile</Text>
            <TouchableHighlight 
                onPress={() => {
                    console.log('Press Button');
                    this.forceCheckTheConnectionAfterError();
                    }
                }
            >
                <Text>Retry</Text>
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
