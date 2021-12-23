import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

import DocFrom from './docFrom'
import DocTo from './docTo'

const styles = {
    root: {
        flexGrow: 1,
    },
};

class SimpleTabs extends React.Component {

    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentWillMount() {
        this.props.onChangeBarTitle('分享文档')
        this.props.onChangeChildFuncion(this)
    }

    render() {
        const { value } = this.state;
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="分享给我的" />
                    <Tab label="我分享的" />
                </Tabs>
                <Divider />
                {
                    value === 0
                    &&
                    <DocFrom onChangeRefresh={(e) => this.props.onChangeRefresh(e)} />
                }
                {
                    value === 1
                    &&
                    <DocTo onChangeRefresh={(e) => this.props.onChangeRefresh(e)} />
                }
            </Paper>
        );
    }
}

SimpleTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);