return(
  <td>
    <div className="orderBox1">
      <table>
        <tr>
          <td>
            <Badge className="tableBadge">{order.tableNo}桌</Badge>
          </td>
          {
            order.acked===1?
            <td>
              <Button bsStyle="default" name='print' 
              id={index+indexArray*3}
              className="printBtn" 
              onClick={this.showPrint}>打印
            </Button>
            </td>


            :
            <td>
              <Button bsStyle="default" name='acked' 
              id={index+indexArray*3}
              className="printBtn ackBtn" 
              onClick={this.handleStatus}>接收
            </Button>
            </td>

          }

          {
            order.acked===1?
            <td>
            <Button bsStyle="default" name='checked' 
              id={index+indexArray*3}
              value=''
              className="pull-right" 
              onClick={this.handleStatus}>{order.checked?'已结':'结算'}
            </Button>
            </td>
            :
            <td>
            <Button bsStyle="default" name='cancel' 
              id={index+indexArray*3}
              value=''
              className="pull-right"
              onClick={this.handleStatus}>取消
            </Button>
            </td>
          }
        </tr>

        <tr>
          <td>第{this.props.orderMisc.count- 20*(this.state.activePage-1) -index-indexArray*3}份订单,
            金额{order.totalprice},
            下单时间
            {((new Date(order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
          </td>
        </tr>

          {
            order.products.map((product,index_p)=>{

              return(
                <tr >
                  <td>
                    {product.title} &nbsp;&nbsp;&nbsp;x{product.quantity}
                  </td>

                <td>

                  {
                    order.acked===1?
                    <Button bsStyle="default" name='status'
                      id={index+indexArray*3}
                      value={index_p}

                      className={product.status?"doneButton":"undoButton"}
                    onClick={this.handleStatus}>
                    {product.status?'已接':'接收'}
                    </Button>
                    :null
                  }
                  
                </td>

                <td>
                  {
                    order.acked===1?
                    <OverlayTrigger placement="top" overlay={product.status?tooltipNone:tooltip}>
                    <Button bsStyle="default" 
                      className={(product.complete===product.quantity)?"doneButton":"undoButton"}
                      ref="target" name='complete'
                      id={index+indexArray*3}
                      value={index_p}
                      
                      onClick={this.handleStatus}>
                      {product.complete==undefined||product.complete==0?'上桌':'已上 '+product.complete}
                    </Button>
                    </OverlayTrigger>
                    :null
                  }
                    
                </td>
                

                </tr>
                )}
          )}
      </table>
    </div>
  </td>
  
)