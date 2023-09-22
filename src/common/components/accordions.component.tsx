import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { IAccordionTemplate } from "../interfaces/accordions.interfaces";

interface IProps {
    data: IAccordionTemplate[]
    defaultActive?: number;
    multiple?: boolean;
}

const AccordionsComponent = ((props: IProps) => {
    const { data, defaultActive, multiple = false } = props;
    
    return (
        <Accordion multiple={multiple} activeIndex={defaultActive || null}>
            {data.map(accordion => {
                return (
                    <AccordionTab header={accordion.name} key={accordion.id} disabled={accordion.disabled}>
                        {accordion.content}
                    </AccordionTab>
                );
            })}
        </Accordion>)
});

export default React.memo(AccordionsComponent);