import React, { Component } from 'react';
import web3 from '../ethereum/instances/web3';
import bank from '../ethereum/instances/bank';
import XYZToken from '../bin/contracts/XYZToken';
import 'semantic-ui-css/semantic.min.css';
import Clock from 'react-live-clock';
import { Header, Grid, Button, Card, Form, Input, Message } from 'semantic-ui-react';

export default class BankIndex extends Component {
    static async getInitialProps() {
        const tokenAddress = await bank.methods.token().call();
        const token = await new web3.eth.Contract(
            XYZToken.abi,
            tokenAddress
        );

        const totalSupply = await token.methods.totalSupply().call();
        const activeUsers = await bank.methods.activeUsers().call();
        const rewardPool = await bank.methods.rewardPool().call();

        let timeBlock = await bank.methods.timeBlock().call();
        let startTime = await bank.methods.startTime().call();
        const st=new Date(startTime *1000); startTime = st.toLocaleTimeString();
        const p1 = timeBlock / 60;
        const p2 = timeBlock * 2 / 60;
        const p3 = timeBlock * 3 / 60;
        const p4 = timeBlock * 4 / 60;
        timeBlock = timeBlock / 60;
        
        return {
            tokenAddress,
            token,
            totalSupply,
            activeUsers,
            rewardPool,
            timeBlock,
            startTime,
            p1, p2, p3, p4
        };
    }

    fixDate = (date) => {
        let dateLocal = new Date(date);
        let newDate = new Date(
          dateLocal.getTime() - dateLocal.getTimezoneOffset() * 60 * 1000
        );
        return newDate;
      };

    state = {
        numToken: '',
        errorMessageD: '',
        errorMessageW: '',
        loadingD: false,
        loadingW: false,
    };

    onDeposit = async (event) => {
        event.preventDefault();
        this.setState({ loadingD: true, errorMessageD: ''});

        try {
            const accounts = await web3.eth.getAccounts();

            await bank.methods.deposit(this.state.numToken).send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.numToken,'gwei')
            });
            window.location.reload();
        } catch (error) {
            this.setState({ errorMessageD: error.message });            
        }
        this.setState({ loadingD: false });
    };

    onWithdraw = async (event) => {
        event.preventDefault();
        this.setState({ loadingW: true, errorMessageW: ''});

        try {
            const accounts = await web3.eth.getAccounts();

            await bank.methods.withdraw().send({from: accounts[0]});
            window.location.reload();
        } catch (error) {
            this.setState({ errorMessageW: error.message });            
        }
        this.setState({ loadingW: false });
    };

    renderInfo() {
        const info =[
            {
                fluid: true,
                header: 'Welcome to the bank of XYZTokens, which enables anyone to deposit an amount X of XYZ tokens to their savings account! The bank also contains an additional amount of XYZ tokens as a reward pool',
                meta: 'This is how it works:',
                description: 'During the first period of time the users can deposit tokens. After the first block of time has passed, no more deposits are allowed. Also, from the start until two blocks of T pass, users cannot withdraw their tokens. After this last period has passed, the users can withdraw their tokens. However, the longer they wait, the bigger the reward they get:'
            },
            {
                fluid: true,
                description: 'If a user withdraws tokens during the period before the third block of time, they collect a proportional amount of the reward pool of 20%. If a user withdraws tokens during the period before the fourth, they collect a proportional amount of the remaining reward pool 20% and 30%. If the user withdraws tokens after the fourth has passed since contract deployment, they can receive the full reward.'
            },
        ];
        return <Card.Group items={info} />;
    }

    render() {
        return (
            <div>
                <Header textAlign={'center'} style={{ marginTop: '5px'}} as='h1'>XYZToken Bank</Header>
                <Grid style={{ marginTop: '5px', marginRight: '5px', marginLeft: '5px'}}>
                    {this.renderInfo()}
                </Grid>
                
                <Grid centered style={{marginTop: '50px'}}>
                    <Grid.Row>

                        <Grid.Column width={5} style={{marginRight: '50px'}}>
                            <Form success onSubmit={this.onDeposit} error={!!this.state.errorMessageD}>
                                <Form.Field>
                                    <p>Minimum Amount of tokens deposit - 10</p>
                                    <Input
                                        label="Gwei"
                                        labelPosition="right"
                                        value={this.state.numToken}
                                        onChange={event => this.setState({numToken: event.target.value })}
                                    />
                                </Form.Field>
                                <Message error header="Attention!" content={this.state.errorMessageD} />
                                <Button loading={this.state.loadingD} primary>Deposit</Button>
                            </Form>
                        </Grid.Column>
                        
                        <Grid.Column width={5} style={{marginLeft: '100px', marginTop: '52px'}}>
                            <Form success onSubmit={this.onWithdraw} error={!!this.state.errorMessageW}>
                                <Message error header="Attention!" content={this.state.errorMessageW} />
                                <Button loading={this.state.loadingW} primary>Withdraw</Button>
                            </Form>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>

                <Grid centered style={{marginTop: '50px'}}>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Card centered>
                                <Card.Content>
                                    <Card.Header>TotalSupply: {this.props.totalSupply}</Card.Header>
                                    <Card.Meta>Active Users: {this.props.activeUsers}</Card.Meta>
                                    <Card.Description>Reward Pool: {this.props.rewardPool}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>Token Address: {this.props.tokenAddress}</Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column width={7}>
                            <Card centered>
                                <Card.Content>
                                    <Card.Header><Clock format={'HH:mm:ss'} ticking={true} timezone={'UTC'} /></Card.Header>
                                    <Card.Meta>Starting time: {this.props.startTime}</Card.Meta>
                                    <Card.Description>End of Period 1: {this.props.p1}m | End of period 2: {this.props.p2}m | End of period 3: {this.props.p3}m | End of period 4: {this.props.p4}m </Card.Description>
                                </Card.Content>
                                <Card.Content extra>Block of time: {this.props.timeBlock} minutes</Card.Content>
                            </Card>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
