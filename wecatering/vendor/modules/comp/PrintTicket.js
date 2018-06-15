import React from 'react'

class PrintTicket extends React.Component{
  constructor(props) {
    super(props)
      this.state = {

    }

    this.printTicket=this.printTicket.bind(this)
    
  }


  printTicket(event){
    // var printContents = document.getElementById("PrintArea").innerHTML
    // document.body.innerHTML = printContents
    window.print()
    this.props.showPrint(event)
    this.props.router.push('/shop/admin')
    // console.log(this.props)
  }

  render() {
    return (
        <div className="PrintContent white-bg">
        <div className="PrintArea" id="PrintArea">
        <span>
          
          第{this.props.order.tableNo}桌 &nbsp;&nbsp;下单时间
          {((new Date(this.props.order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
        </span>
        <div>
        
          {
            this.props.order.products.map((product,index_p)=>{

              return(
                <div className="print-col"> 
                <span className="print-col-lf">
                  {product.title} &nbsp;&nbsp;&nbsp;
                </span>

                <span className="print-col-rt">
                  {product.price} &nbsp;x{product.quantity}
                </span>
               </div>
                )}
          )}
          
          </div>
          </div>
          <div >
            ----------------
          </div>
          <div >
            总计：&nbsp;{this.props.order.totalprice}
          </div>
          <div className="noprint printSubmit">
            <button onClick={this.printTicket}>确定</button>
          </div>
        </div>
        )
  }
}

export default PrintTicket
