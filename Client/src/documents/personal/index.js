import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import UUID from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Attachment from '@material-ui/icons/Attachment';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Collapse from '@material-ui/core/Collapse';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DoneIcon from '@material-ui/icons/Done';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/DeleteSweep';
import AddCircleOutline from '@material-ui/icons/YoutubeSearchedFor';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';

import Loading from '../../common/loading'
import TableHeader from './components/TableHeader'
import AuthService from '../../common/authService'
import { LocalStorageKey } from '../../common/config'
import SelectUser from './components/selectUser'
import TablePaginationActionsWrapped from './components/TablePagination'
import MoveToFolder from './components/moveToFolder'

class Documents extends React.Component {
    _isMounted = true;
    constructor(props) {
        super(props)
        this.authService = new AuthService()
        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: [],
            searchData: [],
            page: 0,
            rowsPerPage: 12,
            uploadloading: false,
            noticeOpen: false,

            selectUser: false,

            addUserShareCheckBox: true,

            noticeMessage: null,
            viewdetail: false,
            toolBar: false,
            tabValue: 0,
            rightDrawer: false,
            subBar: false,

            tabIndex: 0,
            tabBarButtonArea: true,

            stepOneValue: ' ',
            stepOneError: false,
            deleteLoading: false,
            openMoveFile: false,

            anchorEl: null,

            AwaySearch: true,
            AwaySearchInput: false,

            searchSelectFileName: '',
            searchSelectType: '',
            searchSelectOneFileType: true,
            searchStyle: false,
            searchSelectFileSize: '',
            searchPublicShareExpireTime: '',

            folderName: '',
            newFileName: '',

            fileType: '',
            filePath: '/',
            fileSize: '',
            fileCreateTime: '',
            fileOwner: '',
            fileStatus: null,
            filepublicShareId: '',

            shareUserTextField: '',
            shareUsersList: [],

            publicShareId: '',
            publicShareUrl: '',
            publicShareExpireTime: '',
            publicShareDownloadCode: '',

            showRename: [],

            listenerDateFormatInput: false,
            listenerSelectUser: false
        };
    }

    componentDidMount() {
        this.props.onChangeBarTitle('我的文档')
        this.RefreshInfo()
        this.props.onChangeChildFuncion(this)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    RefreshInfo(props) {
        this.props.onChangeRefresh(true)
        let info = JSON.stringify({
            userId: this.getToken().u.i,
            path: this.state.filePath
        })

        this.authService.postData('/file/lists', info).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    let value = {
                        data: res.message,
                        searchData: res.message,
                        rightDrawer: false,
                        selected: [],
                    }

                    let objects = Object.assign(value, props);
                    this.setState(objects)
                } else {
                    let value = {
                        data: [],
                        searchData: [],
                        selected: [],
                        rightDrawer: false,
                        noticeOpen: true,
                        noticeMessage: res.message
                    }

                    let objects = Object.assign(value, props);
                    this.setState(objects)
                }
                this.props.onChangeRefresh(false)
            }
        })
    }

    getToken() {
        return JSON.parse(localStorage.getItem(LocalStorageKey))
    }

    desc(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    getSorting(order, orderBy) {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
    }

    handleRequestSort = (_, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    }

    onClickCreateFolder = () => {
        if (this.state.folderName !== '') {
            const info = JSON.stringify({
                folderName: this.state.folderName,
                path: this.state.filePath
            })

            this.authService.postData('/file/createfolder', info).then((res) => {
                if (res.result) {
                    this.RefreshInfo({ folderName: '', tabIndex: 0 })
                } else {
                    this.setState({ noticeOpen: true, noticeMessage: res.message })
                }
            })
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '文件夹名称不能为空.' })
        }
    }

    onChangeCreatefolder = (e) => {
        this.setState({ folderName: e.target.value })
    }

    onClickSelectOne = (id, type, filename, typename, size, path, uploadDate) => {
        let newSelected = []

        if (this.state.selected.length > 0 && this.state.selected[0]._id === id) {
            newSelected = this.state.selected.filter(x => { return x._id !== id })
        } else {
            newSelected.push({
                _id: id,
                filename: filename,
                typename: typename,
                size: size,
                path: path,
                uploadDate: uploadDate
            })
        }

        this.setState({
            selected: newSelected,
            rightDrawer: false,
            searchSelectOneFileType: type === 1 ? true : false
        })

    }

    handleChangePage = (_, page) => {
        this.setState({ page });
    }

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    }

    onClickNoticeClose = () => {
        this.setState({ noticeOpen: false });
    }

    isSelected = (id) => {
        let selected = this.state.selected
        return (selected.length > 0 && selected[0]._id === id) ? true : false
    }

    onChangeSearchSelectFileName = (e) => {
        this.setState({ searchSelectFileName: e.target.value }, () => {
            if (this.state.searchSelectFileName === '') {
                this.setState({ searchData: this.state.data })
            } else {
                this.setState({ searchData: this.state.data.filter(x => x.metadata.filename.indexOf(this.state.searchSelectFileName) !== -1) })
            }
        })
    }

    onChangeSearchSelectType = (e) => {
        this.setState({ searchSelectType: e.target.value }, () => {
            if (this.state.searchSelectType === '') {
                this.setState({ searchData: this.state.data })
            } else {
                this.setState({ searchData: this.state.data.filter(x => x.metadata.typename === this.state.searchSelectType) })
            }
        })
    }

    onChangeSearchSelectFileSize = e => {
        this.setState({ searchSelectFileSize: e.target.value }, () => {
            if (this.state.searchSelectFileSize === '') {
                this.setState({ searchData: this.state.data })
            } else {
                this.setState({ searchData: this.state.data.filter(x => x.metadata.size >= this.state.searchSelectFileSize) })
            }
        })
    }

    onChangeSearchPublicShareExpireTime = e => {
        this.setState({
            searchPublicShareExpireTime: e.target.value,
            searchData: this.state.data.filter(x => {
                return x.uploadDate.split('T')[0] === e.target.value
            })
        })
    }

    onClickTabIndex = (e) => {
        if (this.state.tabIndex === e) {
            this.setState({ tabIndex: 0, tabBarButtonArea: false });
        }
        else {
            this.setState({ tabIndex: e, tabBarButtonArea: false });
        }
    }

    onChangeSearch = (e) => {
        this.setState({ search: e.target.value })
    }

    onChangeFileInput = () => {
        if (this.InputFile.value) {
            this.setState({ stepOneValue: this.InputFile.files[0].name, filename: this.InputFile.files[0].name })
        }
    }

    onMouseOverSearch = () => {
        this.setState((state) => ({ searchStyle: !state.searchStyle }))
    }

    onClickSelectUsersOpenDialog = () => {
        this.setState((state) => ({ selectUser: !state.selectUser }))
    }

    onClickViewDetail = () => {
        this.setState((state) => ({ viewdetail: !state.viewdetail }))
    }

    onClickUploadFile = () => {

        if (this.InputFile.files.length > 0) {
            this.setState({ uploadloading: true })

            const info = JSON.stringify({
                filename: this.InputFile.files[0].name,
                typename: '',
                fileSize: (this.InputFile.files[0].size / 1000 / 1000).toFixed(3),
                version: 1.0,
                status: 0,
                path: this.state.filePath,
                userId: this.getToken().u.i,
                userDisplayName: this.getToken().u.d,
                shareId: '',
                publicShareId: '',
                publicShareExpireTime: '',
                publicShareUrl: ''
            })

            const data = new FormData();
            data.append("file", this.InputFile.files[0])
            data.append("other", info)
            if (data !== []) {
                this.setState({ noticeOpen: true, noticeMessage: '正在上传中...请耐心等待!' })
                this.authService.uploadFile('/file/upload', data).then((res) => {
                    if (res.result) {
                        this.InputFile.value = null
                        this.RefreshInfo({ noticeOpen: true, noticeMessage: res.message, uploadloading: false, stepOneValue: ' ' })
                    } else {
                        this.setState({ noticeOpen: true, noticeMessage: res.message, uploadloading: false, stepOneValue: ' ' })
                    }
                })
            }
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '请选择需要上传的文档' })
        }
    }

    onClickDownloadFile = () => {
        var info = JSON.stringify({
            id: this.state.selected[0]._id
        })

        this.setState({ noticeOpen: true, noticeMessage: '正在下载中...请耐心等待!' })

        this.authService.downloadFile('/file/down', info).then(res => res.blob().then(blob => {
            if (res.headers.get('Content-Disposition').length > 0) {
                if (window.navigator.msSaveOrOpenBlob) {
                    let filename = res.headers.get('Content-Disposition');
                    window.navigator.msSaveOrOpenBlob(blob, filename);
                }
                else {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    let filename = res.headers.get('Content-Disposition');
                    a.href = url;
                    a.download = decodeURI(filename);
                    a.click();
                    window.URL.revokeObjectURL(url);

                }
                this.setState({ noticeOpen: false, noticeMessage: '' })
            }
        }))
    }

    onClickDeleteFile = () => {
        this.setState({ deleteLoading: true })
        const info = JSON.stringify({
            _id: this.state.selected[0]._id,
            path: this.state.filePath + '/' + this.state.selected[0].filename
        })
        this.setState({ noticeOpen: true, noticeMessage: '正在删除中...请耐心等待!' })
        this.authService.postData('/file/deletes', info).then((res) => {
            if (res.result) {
                this.RefreshInfo({ deleteLoading: false })
            } else {
                this.setState({ noticeOpen: true, noticeMessage: res.message, deleteLoading: false })
            }
        })
    }

    onClickCloseRightDrawer = () => {
        this.setState({ rightDrawer: false, shareUsersList: [] })
    }

    onChangeTabsValue = (_, value) => {
        this.setState({ tabValue: value })
    }

    onChangeShareUserTextField = e => {
        this.setState({ shareUserTextField: e.target.value })
    }

    onClickShareAddUserToList = () => {
        if (this.state.shareUserTextField === '') {
            return false
        }

        const info = JSON.stringify({
            accountName: this.state.shareUserTextField
        })
        this.authService.postData('/file/shareadduser', info).then(res => {
            if (res.result) {
                let v = this.state.shareUsersList.length > 0 ? this.state.shareUsersList : []
                v.push({
                    _id: res.message._id,
                    accountName: res.message.accountName,
                    displayName: res.message.displayName
                })
                this.setState({ shareUsersList: v, shareUserTextField: '' })
            } else {
                this.setState({ noticeOpen: true, noticeMessage: res.message })
            }
        })
    }

    onClickBreadcrumb = (e) => {
        this.props.onChangeRefresh(true)
        let info = JSON.stringify({
            userId: this.getToken().u.i,
            path: e
        })

        this.authService.postData('/file/lists', info).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    let value = {
                        data: res.message,
                        searchData: res.message,
                        filePath: e
                    }
                    this.setState(value)
                }
                this.props.onChangeRefresh(false)
            }
        })
    }

    onCloseSelectUsersDialog = () => {
        this.setState((state) => ({
            selectUser: !state.selectUser
        }))
    }

    onClickAddUsersToList = (e, c) => {
        let list = this.state.shareUsersList.length > 0 ? this.state.shareUsersList : []

        e.map((s) => {
            return list.push({
                _id: s.id,
                accountName: s.other,
                displayName: s.displayName,
                type: s.type
            })
        })

        this.setState((state) => ({ shareUsersList: list, selectUser: !state.selectUser }))
    }

    onClickSubmitShare = () => {
        this.props.onChangeRefresh(true)
        if (this.state.shareUsersList.length > 0) {
            let info = JSON.stringify({
                _id: this.state.selected[0]._id,
                shareUsersList: this.state.shareUsersList
            })

            this.authService.postData('/file/share', info).then((res) => {
                this.RefreshInfo({ noticeOpen: true, noticeMessage: res.message, selected: [] })
            })
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '未找到分享名单列表' })
        }
    }

    onClickCloseShare = () => {
        this.props.onChangeRefresh(true)
        let info = JSON.stringify({
            _id: this.state.selected[0]._id,
        })
        this.authService.postData('/file/unshare', info).then((_) => {
            this.RefreshInfo()
        })
    }

    onClickMoveUserList = (i) => {
        let v = this.state.shareUsersList
        v = v.filter(x => {
            return x._id !== i
        })
        this.setState({ shareUsersList: v })
    }

    onClickCreatePublicShare = (e) => {
        let codeLength = this.state.publicShareDownloadCode.toString().length
        if (codeLength === 6 || codeLength === 0) {
            if (this.state.publicShareExpireTime !== '') {
                if (e) {
                    this.setState({ publicShareUrl: window.location.host + '/download/' + UUID.v4() })
                } else {
                    const info = JSON.stringify({
                        fileId: this.state.selected[0]._id,
                        url: this.state.publicShareUrl,
                        expireTime: this.state.publicShareExpireTime,
                        downloadCode: this.state.publicShareDownloadCode
                    })

                    this.authService.postData('/file/sharepublic', info).then((res) => {
                        if (res.result) {
                            this.RefreshInfo({ publicShareExpireTime: '', publicShareUrl: '' })
                        } else {
                            this.setState({ noticeOpen: true, noticeMessage: res.message })
                        }
                    })
                }
            } else {
                this.setState({ noticeOpen: true, noticeMessage: '未设置过期时间' })
            }
        }
        else {
            this.setState({ noticeOpen: true, noticeMessage: '设置下载码有误!' })
        }

    }

    onClickClosePublicShare = () => {
        this.props.onChangeRefresh(true)
        const info = JSON.stringify({
            fileId: this.state.selected[0]._id,
            url: this.state.publicShareUrl
        })
        this.authService.postData('/file/shareclosepublic', info).then((_) => {
            this.RefreshInfo({ publicShareExpireTime: '', publicShareUrl: '', selected: [] })
        })
    }

    onClickConfirmMoveFile = value => () => {
        this.props.onChangeRefresh(true)

        const info = JSON.stringify({
            fileId: this.state.selected[0]._id,
            location: value.metadata.location
        })

        this.authService.postData('/file/movetofolder', info).then((_) => {
            this.RefreshInfo({ openMoveFile: false, selected: [] })
            this.props.onChangeRefresh(false)
        })
    }

    onClickOpenMoveFile = () => {
        this.setState((state) => ({ openMoveFile: true }))
    }

    onClickCloseMoveFile = () => {
        this.setState((state) => ({ openMoveFile: false, selected: [] }))
    }

    onChangeDateChange = e => {
        this.setState({ publicShareExpireTime: e.target.value });
    }

    onClickClickAway = () => {
        if (this.state.AwaySearch) {
            this.setState({ tabIndex: 0 });
        }
    }

    onClickRename = event => {
        this.setState({ anchorEl: this.state.anchorEl === null ? event.currentTarget : null })
    }

    onClickCancelBtnRename = () => {
        this.setState({ anchorEl: null })
    }

    onClickConfirmBtnRename = () => {
        this.props.onChangeRefresh(true)

        const info = JSON.stringify({
            fileId: this.state.selected[0]._id,
            fileName: this.state.newFileName
        })

        this.authService.postData('/file/rename', info).then(res => {
            if (res.result) {
                this.RefreshInfo({ anchorEl: null, newFileName: '' })
            }
            else {
                this.setState({ noticeOpen: true, noticeMessage: res.message })
                this.props.onChangeRefresh(false)
            }
        })
    }

    onChangeRename = (e) => {
        this.setState({ newFileName: e.target.value })
    }

    onClickShareFileButton = () => {
        this.props.onChangeRefresh(true)

        const info = JSON.stringify({
            _id: this.state.selected[0]._id
        })

        this.authService.postData('/file/shareinfo', info).then((res) => {
            this.props.onChangeRefresh(false)
            if (res.result) {
                this.setState((state) => ({
                    addUserShareCheckBox: res.message.file.metadata.shareId.length > 0 ? true : false,
                    shareUsersList: res.message.file.metadata.shareId,
                    publicShareId: res.message.file.metadata.publicShareId,
                    publicShareUrl: res.message.file.metadata.publicShareUrl,
                    publicShareExpireTime: res.message.file.metadata.publicShareExpireTime !== '' ? res.message.file.metadata.publicShareExpireTime : this.state.publicShareExpireTime,
                    publicShareDownloadCode: res.message.downloadCode !== undefined ? res.message.downloadCode : '',
                    rightDrawer: !state.rightDrawer
                }))
            }
            else {
                this.setState((state) => ({ rightDrawer: !state.rightDrawer }))
            }
        })
    }

    onClickTabBottonBack = () => {
        this.setState((state) => ({ tabBarButtonArea: !state.tabBarButtonArea, tabIndex: 0 }))
    }

    onClickCellFileName = (e) => {

        this.props.onChangeRefresh(true)

        const currentpath = this.state.filePath.length === 1 ? this.state.filePath + e : this.state.filePath + '/' + e

        let info = JSON.stringify({
            userId: this.getToken().u.i,
            path: currentpath
        })

        this.authService.postData('/file/intofolder', info).then((res) => {
            if (this._isMounted) {
                if (res.result) {
                    this.setState({
                        data: res.message,
                        searchData: res.message,
                        filePath: currentpath
                    })
                } else {
                    this.setState({
                        data: [],
                        searchData: [],
                        filePath: currentpath,
                        noticeOpen: true,
                        noticeMessage: res.message
                    })
                }
                this.props.onChangeRefresh(false)
            }
        })
    }

    onChangePublicShareDownloadCode = (e) => {
        this.setState({ publicShareDownloadCode: e.target.value })
    }

    render() {
        const { classes } = this.props;
        const {
            searchData,
            selectUser,
            order, orderBy, selected, rowsPerPage, page, noticeOpen, noticeMessage, deleteLoading, uploadloading,
            rightDrawer, tabValue,
            searchSelectOneFileType, searchSelectFileName, searchSelectType, searchSelectFileSize, searchPublicShareExpireTime,
            folderName,
            filePath,
            addUserShareCheckBox,
            shareUserTextField, shareUsersList,
            publicShareId, publicShareUrl, publicShareDownloadCode,
            newFileName,
            tabBarButtonArea,
            publicShareExpireTime,
            tabIndex
        } = this.state;

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, searchData.length - page * rowsPerPage);

        const openRename = Boolean(this.state.anchorEl);

        return (
            <Fragment>

                <Paper className={classes.actionBar}>
                    <Collapse in={!(selected.length > 0)}>
                        <input
                            accept="text/plain;image/*"
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={this.onChangeFileInput}
                            ref={ele => { this.InputFile = ele }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '4px 16px' }}>
                            {
                                tabIndex === 1 ?
                                    <div className={classes.upload}>
                                        <label htmlFor="contained-button-file">
                                            <Button component="span" color="primary">
                                                <Attachment style={{ marginRight: 4 }} /><span style={{ width: 60 }}>点击选择</span>
                                            </Button>
                                        </label>
                                        <TextField
                                            id="filled-read-only-upload-input"
                                            label="被选择的文件"
                                            style={{ marginLeft: 6, marginTop: 4, marginRight: 6 }}
                                            value={this.state.stepOneValue}
                                            margin="normal"
                                            error={this.state.stepOneError}
                                            fullWidth
                                            InputProps={{
                                                disabled: true,
                                            }}
                                        />
                                        <div className={classes.wrapper}>
                                            <Button
                                                color="primary"
                                                disabled={uploadloading}
                                                onClick={this.onClickUploadFile}
                                            >上传</Button>
                                            {uploadloading && <LinearProgress />}
                                        </div>
                                    </div>
                                    : tabIndex === 2 ?
                                        <div className={classes.upload}>
                                            <Button
                                                disabled
                                                aria-haspopup="true"
                                                onClick={this.onClickOpenTagsMenu}
                                            >
                                                名称
                                                </Button>
                                            <TextField
                                                label=""
                                                style={{ marginLeft: 6, marginTop: 4, marginRight: 6 }}
                                                margin="normal"
                                                fullWidth
                                                value={folderName}
                                                onChange={(e) => this.onChangeCreatefolder(e)}
                                            />
                                            <div className={classes.wrapper}>
                                                <Button
                                                    color="primary"
                                                    onClick={this.onClickCreateFolder}
                                                >
                                                    {'创建'}
                                                </Button>
                                            </div>
                                        </div>
                                        : tabIndex === 3 ?
                                            <div style={{ display: 'flex' }}>
                                                <TextField label="名称" className={classes.searchLabel} value={searchSelectFileName} onChange={this.onChangeSearchSelectFileName}
                                                    InputProps={{
                                                        startAdornment: (<div />),
                                                        placeholder: '模糊查询'
                                                    }}
                                                />
                                                <TextField label="类型" className={classes.searchLabel} value={searchSelectType} onChange={this.onChangeSearchSelectType}
                                                    InputProps={{
                                                        startAdornment: (<div />),
                                                        placeholder: '扩展名'
                                                    }}
                                                />
                                                <TextField label="大小" className={classes.searchLabel} value={searchSelectFileSize} onChange={this.onChangeSearchSelectFileSize}
                                                    InputProps={{
                                                        startAdornment: (<div />),
                                                        placeholder: '文件大于MB'
                                                    }}
                                                />

                                                <form noValidate>
                                                    <TextField
                                                        id="date"
                                                        label="上传时间"
                                                        type="date"
                                                        onChange={this.onChangeSearchPublicShareExpireTime}
                                                        value={searchPublicShareExpireTime}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </form>

                                            </div>
                                            :
                                            <div className={classes.LabelTitle} >
                                                <b style={{ marginRight: 15 }}>文档库</b>
                                                [<span className={classes.breadcrumb} style={{ marginLeft: 6 }} onClick={() => this.onClickBreadcrumb('/')}>/</span>
                                                {
                                                    filePath.split('/').map((v, i) => {
                                                        return (v.length > 0 ? <span key={i} className={classes.breadcrumb} onClick={() => this.onClickBreadcrumb(`/${v}`)}>{v}</span> : null)
                                                    })
                                                }]
                                                </div>
                            }

                            {
                                tabBarButtonArea ?
                                    <div style={{ display: 'flex' }}>
                                        <Tooltip title="上传">
                                            <IconButton style={{ color: '#FF8A65' }} onClick={() => this.onClickTabIndex(1)}>
                                                <CloudUploadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="文件夹">
                                            <IconButton onClick={() => this.onClickTabIndex(2)}>
                                                <FolderOpenIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="搜索">
                                            <IconButton onClick={() => this.onClickTabIndex(3)}>
                                                <SearchIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    :
                                    <Tooltip title="返回">
                                        <IconButton style={{ color: '#fdb94e' }} onClick={this.onClickTabBottonBack}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </Tooltip>
                            }
                        </div>
                    </Collapse>

                    <Collapse in={(selected.length > 0)}>
                        <div className={classes.highlight} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '4px 16px' }}>
                            <Typography variant="h6" style={{ padding: 8, color: '#626262' }}>{selected.length > 0 ? selected[0].filename : null}</Typography>
                            {
                                deleteLoading && <LinearProgress className={classes.deleteProgress} />
                            }
                            <div style={{ display: 'flex' }}>
                                {
                                    searchSelectOneFileType &&
                                    <Tooltip title="分享" onClick={this.onClickShareFileButton}>
                                        <IconButton style={{ color: '#FF8A65' }}>
                                            <ShareIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {
                                    searchSelectOneFileType &&
                                    <Tooltip title="下载">
                                        <IconButton onClick={this.onClickDownloadFile}>
                                            <CloudDownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title="移动" onClick={this.onClickOpenMoveFile}>
                                    <IconButton>
                                        <HowToVoteIcon />
                                    </IconButton>
                                </Tooltip>
                                {
                                    searchSelectOneFileType &&
                                    <Tooltip title="重命名" onClick={this.onClickRename}>
                                        <IconButton>
                                            <CreateIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title="删除">
                                    <IconButton onClick={this.onClickDeleteFile}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </Collapse>
                </Paper>

                <Paper className={classes.root}>
                    <Grid container spacing={0}>
                        <Grid item xs={9}>
                            <Table>
                                <TableHeader
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={searchData.length}
                                />
                                <TableBody>
                                    {
                                        searchData.length > 0 ?
                                            this.stableSort(searchData, this.getSorting(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map(n => {
                                                    const isSelected = this.isSelected(n._id, n.metadata.filename);
                                                    return (
                                                        <TableRow
                                                            key={n._id}
                                                            selected={isSelected}
                                                            style={n.metadata.status === 1 ? { borderLeft: '2px solid rgb(255, 152, 0)' } : {}}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onClick={() => this.onClickSelectOne(n._id, n.metadata.type, n.metadata.filename, n.metadata.typename, n.metadata.size, n.metadata.path, n.uploadDate, n.metadata.publicShareId, n.metadata.publicShareUrl, n.metadata.publicShareExpireTime, n.metadata.type)}
                                                                />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" padding="none">
                                                                <span
                                                                    aria-describedby={n._id}
                                                                    className={n.metadata.type === 1 ? classes.link1 : classes.link2}
                                                                    onClick={n.metadata.type === 0 ? () => this.onClickCellFileName(n.metadata.filename) : null}
                                                                >
                                                                    {n.metadata.filename}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{n.metadata.type === 1 ? n.metadata.typename : 'folder'}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{n.uploadDate.split('T')[0]}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{n.metadata.size}</TableCell>
                                                        </TableRow>
                                                    );
                                                })

                                            :
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Loading number={[0, 1, 2, 3, 4]} />
                                                </TableCell>
                                            </TableRow>
                                    }

                                    {
                                        emptyRows > 0 && (
                                            <TableRow style={{ height: 43 * emptyRows }}>
                                                <TableCell colSpan={5} />
                                            </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={3} style={{ borderLeft: '1px solid #D9D9D9', borderBottom: '1px solid #D9D9D9' }}>

                            <List component="nav" className={classes.fileTitle}>
                                {
                                    selected.length > 0 ?
                                        <Fragment>
                                            <img src={`/imgs/type/${selected[0].typename}.png`} height={'120'} alt=''></img>
                                        </Fragment>
                                        :
                                        null
                                }
                            </List>

                            {
                                selected.length > 0 && searchSelectOneFileType ?
                                    <Fragment>
                                        <List dense={true} component="nav" style={{ paddingBottom: 10 }}>
                                            <ListItem className={classes.ListItem}>
                                                <ListItemText style={{ marginLeft: 12, marginBottom: 12 }} primary={'文件信息'} />
                                            </ListItem>
                                            <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'名称'}</span>
                                                <ListItemText className={classes.listItemText} primary={`${selected[0].filename}`} />
                                            </ListItem>
                                            <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'类型'}</span>
                                                <ListItemText className={classes.listItemText} primary={`${selected[0].typename}`} />
                                            </ListItem>
                                            <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'大小'}</span>
                                                <ListItemText className={classes.listItemText} primary={`${selected[0].size}MB`} />
                                            </ListItem>
                                            <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'位置'}</span>
                                                <ListItemText className={classes.listItemText} primary={`${selected[0].path}`} />
                                            </ListItem>
                                            {/* <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'所属者'}</span>
                                                <ListItemText primary={fileOwner} />
                                            </ListItem> */}
                                            <ListItem className={classes.ListItem}>
                                                <span className={classes.cellTitle}>{'时间'}</span>
                                                <ListItemText className={classes.listItemText} primary={`${selected[0].uploadDate}`} />
                                            </ListItem>
                                        </List>
                                    </Fragment>
                                    :
                                    null
                            }

                        </Grid>
                    </Grid>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 25]}
                        component="div"
                        count={searchData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': '上一页',
                        }}
                        nextIconButtonProps={{
                            'aria-label': '下一页',
                        }}
                        SelectProps={{
                            native: true,
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'每页'}
                        ActionsComponent={TablePaginationActionsWrapped}
                    />
                </Paper>

                <SelectUser classes={{ paper: classes.paper }} open={selectUser} onClose={this.onCloseSelectUsersDialog} onClickAddUsersToList={(x, y) => this.onClickAddUsersToList(x, y)} />
                <MoveToFolder open={this.state.openMoveFile} onClickCloseMoveFile={this.onClickCloseMoveFile} onClickConfirmMoveFile={this.onClickConfirmMoveFile} />

                <Popper
                    open={openRename}
                    anchorEl={this.state.anchorEl}
                    transition
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper className={classes.rename}>
                                <TextField
                                    label="更改名称?"
                                    style={{ marginBottom: 8 }}
                                    InputProps={{
                                        startAdornment: (<div />)
                                    }}
                                    value={newFileName}
                                    onChange={this.onChangeRename}
                                />
                                <Grid container justify="center" spacing={1}>
                                    <Grid item>
                                        <Button color="primary" size={'small'} onClick={this.onClickConfirmBtnRename}>
                                            {'确定'}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button color="primary" size={'small'} onClick={this.onClickCancelBtnRename}>
                                            {'取消'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                    )}
                </Popper>

                <Drawer
                    anchor="right"
                    variant="persistent"
                    open={rightDrawer}
                    onClose={this.onClickCloseRightDrawer}
                    classes={{
                        paperAnchorRight: classes.drawerPaper
                    }}
                >
                    <div className={classes.toolbar} />

                    <AppBar position="static" color="primary">
                        <Tabs
                            value={tabValue}
                            onChange={this.onChangeTabsValue}
                        >
                            <Tab label="私有分享" style={{ width: 229 }} />
                            <Tab label="公有分享" style={{ width: 229 }} />
                        </Tabs>
                    </AppBar>

                    {
                        tabValue === 0 &&
                        <div className={classes.rightDrawerPaper}>
                            <p>文件名:</p>
                            <Typography className={classes.TypographyFileName}>{selected.length > 0 && selected[0].filename}</Typography>
                            {
                                addUserShareCheckBox ?
                                    null
                                    :
                                    <>
                                        <TextField
                                            label="姓名或账户名"
                                            value={shareUserTextField}
                                            className={classes.textFieldCode}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            helperText="输入登录账户添加至名单"
                                            onChange={(e) => this.onChangeShareUserTextField(e)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="验证并添加">
                                                            <IconButton
                                                                style={{ marginTop: -16 }}
                                                                onClick={this.onClickShareAddUserToList}
                                                            >
                                                                {<DoneIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <div className={classes.actionShareButtom}>
                                            <Tooltip title="添加名单">
                                                <IconButton onClick={this.onClickSelectUsersOpenDialog}><AddCircleOutline /></IconButton>
                                            </Tooltip>
                                        </div>
                                    </>
                            }
                            <TextField
                                label="分享名单"
                                multiline
                                value={''}
                                className={classes.textFieldShare}
                                margin="normal"
                                variant="outlined"
                                rows="16"
                                disabled
                                InputLabelProps={{
                                    shrink: true
                                }}
                                helperText="选择单击用户移除名单"
                            />
                            <List className={classes.listShareAddUser} dense={true}>
                                {
                                    shareUsersList.length > 0 ?
                                        shareUsersList.map((v, i) => {
                                            return <ListItem
                                                key={i}
                                                button
                                                onClick={() => this.onClickMoveUserList(v._id)}
                                            >
                                                <Avatar alt="" src="/imgs/user/default.png" />
                                                <ListItemText primary={v.displayName} secondary={v.accountName} />
                                            </ListItem>
                                        })
                                        : null
                                }

                            </List>
                            {
                                addUserShareCheckBox ?
                                    <Button variant="contained" size="small" color="primary" className={classes.confirmButton} onClick={this.onClickCloseShare}>撤销分享</Button>
                                    :
                                    <Button variant="contained" size="small" color="primary" className={classes.confirmButton} onClick={this.onClickSubmitShare}>分享</Button>
                            }
                            <Button variant="contained" size="small" color="secondary" className={classes.cancelButton} onClick={this.onClickCloseRightDrawer}>取消</Button>
                        </div>
                    }

                    {
                        tabValue === 1 &&
                        <div className={classes.rightDrawerPaper}>
                            <p>文件名:</p>
                            <Typography className={classes.TypographyFileName}>{selected.length > 0 && selected[0].filename}</Typography>
                            <form noValidate>
                                <TextField
                                    id="date2"
                                    label="设置过期时间"
                                    type="date"
                                    onChange={this.onChangeDateChange}
                                    value={publicShareExpireTime}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                            <form style={{ marginTop: 12 }}>
                                <TextField
                                    label="设置下载码"
                                    type="number"
                                    placeholder={'六位数字或者不设置'}
                                    onChange={(e) => this.onChangePublicShareDownloadCode(e)}
                                    value={publicShareDownloadCode}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                            <TextField
                                label="生成分享链接"
                                multiline
                                value={publicShareUrl}
                                onChange={null}
                                margin="normal"
                                variant="outlined"
                                disabled
                                helperText="链接发送给分享对象"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                            {
                                publicShareId === '' ?
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        className={classes.confirmButton}
                                        onClick={
                                            publicShareUrl === '' ?
                                                () => this.onClickCreatePublicShare(true)
                                                :
                                                () => this.onClickCreatePublicShare(false)
                                        }
                                    >
                                        {
                                            publicShareUrl === '' ? '生成' : '分享'
                                        }
                                    </Button>
                                    :
                                    <Button variant="contained" size="small" color="primary" className={classes.confirmButton} onClick={this.onClickClosePublicShare}>关闭分享</Button>
                            }

                            <Button variant="contained" size="small" color="secondary" className={classes.cancelButton} onClick={this.onClickCloseRightDrawer}>取消</Button>
                        </div>
                    }
                </Drawer>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={noticeOpen}
                    onClose={this.onClickNoticeClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}>
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{ display: 'flex', alignItems: 'center', }}>
                                {noticeMessage}
                            </span>
                        }
                    />
                </Snackbar>

            </Fragment>
        );
    }
}

Documents.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        minWidth: 900
    },
    flexcentercenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    textFieldCode: {
        marginTop: 6
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    img: {
        marginRight: 4
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    upload: {
        display: 'flex',
        alignItems: 'center',
        height: 48,
        width: '100%',
        borderRight: '1px solid lightgray',
        marginRight: 12
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    actionBar: {
        marginBottom: 12
    },
    deleteProgress: {
        width: 100,
        marginLeft: 14,
        marginTop: 20
    },
    LabelTitle: {
        display: 'flex',
        marginLeft: 15,
        paddingTop: 12,
        color: 'gray'
    },
    shareButton: {
        margin: '0px 20px',
        width: 300,
        backgroundColor: 'rgba(63, 81, 181, 0.08)',
        '&:hover': {
            backgroundColor: '#4699ff29',
        }
    },
    confirmButton: {
        margin: '4px'
    },
    cancelButton: {
        margin: '4px',
        color: 'white',
        backgroundColor: '#ec3b3b',
        '&:hover': {
            backgroundColor: '#e63131',
        }
    },
    toolbar: theme.mixins.toolbar,
    tableCell: {
        padding: '0px 10px'
    },
    link1: {
        color: theme.palette.primary.main,
        textDecoration: 'underline'
    },
    link2: {
        color: '#4caf50',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    closeBottom: {
        color: theme.palette.primary.main,
        fontSize: 28
    },
    fileTitle: {
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cellTitle: {
        fontSize: 14, paddingLeft: 34, color: 'gray'
    },
    ListItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    drawerPaper: {
        width: 460,
        boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.2)',
    },
    rightDrawerPaper: {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        padding: '0 20px'
    },
    TypographyFileName: {
        wordBreak: 'break-word',
        marginBottom: 15
    },
    textFieldShare: {
        marginTop: 0,
        marginBottom: 20,
        zIndex: 99
    },
    actionShareButtom: {
        justifyContent: 'flex-end',
        display: 'flex',
        marginTop: -10,
        zIndex: 101
    },
    listShareAddUser: {
        height: 320,
        zIndex: 100,
        overflow: 'auto',
        position: 'relative',
        marginTop: -370,
        marginBottom: 40
    },
    breadcrumb: {
        textDecoration: 'underline',
        marginRight: 6,
        cursor: 'pointer',
        color: theme.palette.primary.main
    },
    searchLabel: {
        marginRight: 6,
    },
    progress: {
        margin: theme.spacing(0),
        color: '#e0e0e0'
    },
    listItemText: {
        marginLeft: 8,
    },
    rename: {
        padding: '16px 16px 6px 16px'
    }
});

export default withStyles(styles)(Documents);