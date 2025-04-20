/* eslint-disable @next/next/no-sync-scripts */
export default function PaymentPage() {
    return (
        <form>
            <script src='https://checkout.epayco.co/checkout.js'
                data-epayco-key='948899a572833469af43bfbf47632340' 
                className='epayco-button' 
                data-epayco-amount='5000' 
                data-epayco-tax='0.00'  
                data-epayco-tax-ico='0.00'               
                data-epayco-tax-base='5000'
                data-epayco-name='Ficha LavaControl' 
                data-epayco-description='Ficha LavaControl' 
                data-epayco-currency='cop'    
                data-epayco-country='CO' 
                data-epayco-test='true' 
                data-epayco-external='false' 
                data-epayco-response='https://sc-redesign.vercel.app/payment/response'
                data-epayco-confirmation='https://sc-redesign.vercel.app/payment/confirm'
                data-epayco-button='https://multimedia.epayco.co/dashboard/btns/btn5.png'> 
            </script> 
        </form>
    );
}