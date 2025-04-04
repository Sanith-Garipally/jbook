import React from 'react'
import { useTypedSelector } from '../hooks/use-typed-selector'
import CellListItem from './cell-list-item'
import AddCell from './add-cell'
import "./cell-list.css"

const CellList:React.FC = () => {
    const cells = useTypedSelector(({ cells:{order, data} }) => {
        return order.map((id) => {
            return data[id];
        })
    })

    const renderedCells = cells.map((cell) => (
        <React.Fragment key={cell.id}>
            <CellListItem cell={cell}/>
            <AddCell previousCellId={cell.id}/>
        </React.Fragment>
    ))
    
    return (
    <div className='cell-list'>
        <AddCell forceVisible={cells.length === 0} previousCellId={null}/>
        {renderedCells}
    </div>
  )
}

export default CellList