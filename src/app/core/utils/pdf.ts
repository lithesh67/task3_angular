import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDF(product:any): void {
    const doc:any = new jsPDF();

    doc.text(`Product details`, 10, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 255);
    const imgData =product.product_image ; 
    // if(imgData){
    //     doc.addImage(imgData,10, 30, 50, 50);
    // }
    let status="Available"
    if(product.quantity_in_stock==0){
       status="Sold Out"
    }
    autoTable(doc,{
      head: [['Product name','status','category','vendors','quantity','unit','image_url']],
      body: [
       [product.product_name,status,product.category,product.vendors,product.quantity_in_stock,product.measure,imgData]
      ],
      startY: 40
    });

    // Save the PDF
    doc.save(`${product.product_name}_${product.product_id}`);
}
