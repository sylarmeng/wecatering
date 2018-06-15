

import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap'
import {act_addrecipe, act_getrecipe} from '../../actions/act_recipe'

import ReactCrop from 'react-image-crop';
import {ClearMsg} from '../../actions/act_msg'
const styleRequired = {
  color: "#ffaaaa"
}
class EditImg extends React.Component{
  constructor(props) {
    super(props)
    this.state = {      
      warnMsg:'',
      file: '',
      imagePreviewUrl: null,
      previewOrCrop:true,
      pixelCrop: null,
      crop: {
            x: 20,
            y: 20,
            width: 60,
            height: 60
          },
      activeTab: 1,
      thumbUrl: null,
      fullImgUrl: null,
      fullImgFile:'',
      fullPreview: null
    };
    this.handleChange =this.handleChange.bind(this)
    this.closeModal =this.closeModal.bind(this)
    this.setTab = this.setTab.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      'warnMsg':''
    })
  }

  _handleSubmit(e) {
    e.preventDefault();
    // 判断是提交的哪个图片
    if(e.target.name==='thumb'){
      if(this.state.file==='')
        return;
      let { dispatch } = this.props;
      let form = new FormData();
      // 注意dishid不使用state
      form.append('dishid', this.props.dishid);
      if(this.state.pixelCrop!==null){
        form.append('x', this.state.pixelCrop.x);
        form.append('y', this.state.pixelCrop.y);
        form.append('width', this.state.pixelCrop.width);
        form.append('height', this.state.pixelCrop.height);
      }
      form.append('imgType', 'thumb');
      form.append(this.state.file.name, this.state.file);
      dispatch(act_addrecipe(form));
    }
    else{
      if(this.state.fullPreview==='')
        return;
      let { dispatch } = this.props;
      let form = new FormData();
      // 注意dishid不使用state
      form.append('dishid', this.props.dishid);
      form.append('imgType', 'full');
      form.append(this.state.fullImgFile.name, this.state.fullImgFile);
      dispatch(act_addrecipe(form));
    }
      
  }

  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    if(e.target.name==='thumb'){
      
      reader.onloadend = () => {
        this.setState({
          'previewOrCrop': true,
          'pixelCrop': null,
          'file': file,
          'imagePreviewUrl': reader.result
        });
      } 
    }
    else{
      reader.onloadend = () => {
        this.setState({
          'fullImgFile': file,
          'fullPreview': reader.result
        });
      } 
    }
  }

  onCropComplete = (crop, pixelCrop) => {
    // crop is ratio coordinate
    // pixelCrop is real coordinate
    let loadedImg = new Image();
    loadedImg.src = this.state.imagePreviewUrl
    this.setState({
      'pixelCrop':pixelCrop,
      'crop':crop,
      'previewOrCrop':false
    })
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');
    ctx.drawImage(loadedImg, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 100, 100);
  }

  closeModal(event){
    this.setState({
      imagePreviewUrl:null
    })
    this.props.onClose(event)
  }
  // 设置active的tab
  setTab(event){
    let that =this
    switch (event.target.name){
      case 'tab2':
        that.setState({'activeTab':2})
        break
      case 'tab3':
        that.setState({'activeTab':3})
        let dish
        // that.props.recipelist.filter()
        for(let i =0,count =that.props.recipelist.length;i<count;i++ ){
          if(that.props.recipelist[i].id==that.props.dishid){
            that.setState({
              'thumbUrl':that.props.recipelist[i].sampleImage,
              'fullImgUrl':that.props.recipelist[i].fullImage
            })
            break
          }
        }
        break
      default:
        that.setState({'activeTab':1})
    }
  }
  componentDidUpdate() {
      let msgId = this.props.resMSG.msgId;
      let that =this;
      (function(){
        setTimeout(function(){
        that.props.dispatch(ClearMsg(msgId));
      },1000);
      })();
  }
  render() {
    if(!this.props.show) {
      return null;
    }
    let crop = this.state.crop
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} height="100" width="100"/>);
    }

    return (

        <div className="imgEditBox">
          <div className="imgModalBox">

            <div className="tabbable-panel">
              <div className="tabbable-line">
                <ul className="nav nav-tabs imgEditNav">
                  <li className={this.state.activeTab==1?"active":''}>
                    <a href="#tab1" name='tab1' data-toggle="tab" onClick={this.setTab}>
                    缩略图 </a>
                  </li>
                  <li className={this.state.activeTab==2?"active":''}>
                    <a href="#tab2" name='tab2' data-toggle="tab" onClick={this.setTab}>
                    大图 </a>
                  </li>
                  <li className={this.state.activeTab==3?"active":''}>
                    <a href="#tab3" name='tab3' data-toggle="tab" onClick={this.setTab}>
                    所有图片 </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className={this.state.activeTab==1?"tab-pane active":"tab-pane"} id="tab1">
                    <div className="previewComponent">
                      
                        <div>
                          <label className="btn btn-primary fileinputLabel">
                            <span>选择图片</span>
                            <input className="fileInput" 
                            type="file" name="thumb" id="file" 
                            onChange={(e)=>this._handleImageChange(e)} />
                          </label>
                          <button className="btn btn-primary submitButton" 
                            name="thumb"
                            onClick={(e)=>this._handleSubmit(e)}>上传图片</button>
                          </div>
                      
                    </div>
                    <div className="cropBox" >
                      <ReactCrop src={imagePreviewUrl} crop={crop}
                        onComplete={this.onCropComplete}/>
                    </div>
                    {
                      this.state.previewOrCrop?
                      <div className="imgPreview">
                        {$imagePreview}
                      </div>
                      :
                      <div id="canvas" >
                        <canvas id="myCanvas" width="100" height="100">
                          浏览器不支持html5画布
                        </canvas>
                      </div>
                    }
                    
                  </div>
                  <div className={this.state.activeTab==2?"tab-pane active":"tab-pane"} id="tab2">
                    <div className="fullImgTab">
                        <div>
                          <label className="btn btn-primary fileinputLabel">
                            <span>选择图片</span>
                            <input className="fileInput" 
                            type="file" name="full" id="file" 
                            onChange={(e)=>this._handleImageChange(e)} />
                          </label>
                          <button className="btn btn-primary submitButton" 
                            name="full"
                            onClick={(e)=>this._handleSubmit(e)}>上传图片</button>
                          </div>
                          
                    </div>
                    <div>
                      
                      <img src={this.state.fullPreview}
                        width="320" alt="无展示图" />
                      <p>注意：大图将按照在手机上显示的比例进行预览</p>
                      <p>请尽量选择竖长型图片，以在手机端获取最佳显示效果</p>
                    </div>

                  </div>
                  <div className={this.state.activeTab==3?"tab-pane active":"tab-pane"} id="tab3">

                      <table className='imgTable'>
                        <tr>
                          <td>
                            缩略图(实际尺寸)
                          </td>
                          <td>
                            展示图(50%尺寸)
                          </td>
                        </tr>
                        <tr>

                          <td>
                            <img id='thumbImage' src={this.state.thumbUrl?'/static/img/'+this.state.thumbUrl:'/static/img/100.jpg'} 
                                height="100" width="100" alt="无缩略图" />
                          </td>
                          <td>
                            <img id='fullImage' src={this.state.fullImgUrl?'/static/img/'+this.state.fullImgUrl:'/static/img/100.jpg'} 
                                width="200" alt="无展示图" />
                          </td>
                        </tr>
                      </table>

                  </div>
                    
                  
                </div>
              </div>
            </div>

            <hr />
            <div className="closeImgBtn">

              <button className="btn btn-primary" onClick={this.closeModal}>关闭</button>

            </div>       
          </div>          
        </div>
        )
  }
}


EditImg.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool
}

const mapStateToProps = (state) => ({
  recipelist: state.recipelist,
  resMSG: state.resMSG
})
export default connect(mapStateToProps)(EditImg)

// <span id='imgEditWarnMsg'>{this.props.resMSG.msg}</span>