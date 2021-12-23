import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Dropzone from 'react-dropzone'
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';

import AuthService from '../common/authService'

class Adds extends React.Component {

    constructor(props) {
        super(props);
        this.authService = new AuthService()
        this.state = {
            noticeOpen: false,
            noticeMessage: '',
            fileName: '',
            fileSize: '',
            files: []
        };
    }

    componentDidMount() {
        this.props.onChangeBarTitle('批量创建用户')
        this.props.onChangeChildFuncion(this)
    }

    onClickBack = () => {
        this.props.history.go(-1)
    }

    onDropFile = (files) => {
        if (files.length > 0) {
            if (files[0].path.split('.')[1] === 'csv') {
                this.setState({ files: files, fileName: files[0].name, fileSize: files[0].size })
            } else {
                this.setState({ noticeOpen: true, noticeMessage: '上传文件格式有误!' })
            }
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '上传文件未找到!' })
        }
    }

    onClickUploadFile = () => {
        if (this.state.files.length > 0) {
            const data = new FormData()
            data.append("file", this.state.files[0])
            if (data !== []) {
                this.authService.uploadFile('/user/upload', data).then((res) => {
                    this.setState({ noticeOpen: true, noticeMessage: res.message })
                })
            }
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '上传文件未找到!' })
        }
    }

    onClickNoticeClose = () => {
        this.setState({ noticeOpen: false });
    }

    onClickReset = () => {
        this.setState({ files: [] })
    }

    render() {

        const { classes } = this.props;
        const { noticeOpen, noticeMessage, files, fileName, fileSize } = this.state;

        return (
            <div className={classes.root}>

                <div style={{ display: 'flex' }}>
                    <Button variant="contained" color="primary" onClick={this.onClickBack}><ArrowBackIcon /></Button>
                </div>

                <Dropzone onDrop={acceptedFiles => this.onDropFile(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className={classes.dropzone}>拖拽文件至上传区, 或者点击该区域上传文件</div>
                            </div>
                        </section>
                    )}
                </Dropzone>

                <Button variant="contained" color="primary" style={{ marginRight: 8 }} onClick={this.onClickUploadFile}><DoneIcon className={classes.extendedIcon} />上传</Button>
                <Button variant="contained" onClick={this.onClickReset}><UndoIcon className={classes.extendedIcon} />重置</Button>

                {
                    files.length > 0 ?
                        <Typography variant="body1" gutterBottom style={{ padding: '15px 0' }}>
                            <span style={{ color: '#5ABFF7' }}>上传文件:</span><br />
                            名称: {fileName} <br />
                            大小: {fileSize}
                        </Typography>
                        :
                        <Typography variant="body1" gutterBottom className={classes.tipZone}>
                            {`说明:`}
                            <br />
                            {`文件格式: csv`}
                            <br />
                            {`数据示例: 账户名,显示名,密码`}
                            <br />
                            {`zhangsan@contoso.com,张三,123456`}
                            <br />
                            {`lisi@contoso.com,李四,123456`}
                        </Typography>
                }

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={noticeOpen}
                    onClose={this.onClickNoticeClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{ display: 'flex', alignItems: 'center', }}>
                                {noticeMessage}
                            </span>
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    dropzone: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#ffffff',
        height: 150,
        cursor: 'pointer',
        margin: '20px 0 20px 0'
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    bottomCard: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    bottomButton: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 20px'
    },
    cardContent: {
        padding: '15px 40px 30px 40px'
    },
    tipZone: {
        color: 'red',
        padding: '15px 0px'
    }
});

Adds.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Adds);