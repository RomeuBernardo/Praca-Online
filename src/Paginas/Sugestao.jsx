import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import $ from 'jquery';
import Produto from './PracaVendedor';

export default function ResponsiveDemo() {
    const [products, setProducts] = useState([]);
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        carregarDadosProduto();
    }, []);

    const carregarDadosProduto = () => {
        $.ajax({
            url: 'http://localhost:5000/carregar_dados_produto',
            type: 'GET',
            success: function(response) {
                if (response.success && Array.isArray(response.data)) {
                    console.log("Apareceu",response.data);

                    setProducts(response.data);
                    console.log("Apareceu AA",products.nome_produto);


                } else {
                    console.error('Erro ao carregar dados do produto:', response);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados do produto:', error);
            }
        });
    };

    const getSeverity = (inventoryStatus) => {
        switch (inventoryStatus) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
               <p>{product.nome_produto}</p>
                <div className="mb-3">
                    <img src={product.imagem_produto} alt={product.nome_produto} className="w-6 shadow-2" />
                    

                </div>
                <div>
                    <h4 className="mb-1">{product.nome_produto}</h4>
                    <h6 className="mt-0 mb-3">${product.preco}</h6>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product.inventoryStatus)}></Tag>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                        <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        
        <div className="card">
            {products.map((product, index) => (
                <div key={index} className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                    <p>{product.nome_produto}</p>
                    <div className="mb-3">
                        <img src={product.imagem_produto} alt={product.nome_produto} className="w-6 shadow-2" />
                    </div>
                    <div>
                        <h4 className="mb-1">{product.nome_produto}</h4>
                        <h6 className="mt-0 mb-3">${product.preco}</h6>
                        <Tag value={product.inventoryStatus} severity={getSeverity(product.inventoryStatus)}></Tag>
                        <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                            <Button icon="pi pi-search" className="p-button p-button-rounded" />
                            <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    
}    


