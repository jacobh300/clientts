import React, {forwardRef} from "react";
import { DbConnection, ItemRow } from "../../module_bindings";
import { useItems } from "../../lib/hooks";

export type ItemInfo = {itemName: string ,item : ItemRow | null};

//Create a dictonary for items that maps item name to itemRow
export type ItemDict = { [key: string]: ItemRow | null };

export function ItemViewerBar({ conn }: { conn: DbConnection })
{
    const showAllUserItems = true; //Set to true to show all user items, false to only show current identity items 
    const items = useItems(conn);
    console.log("ItemViewerBar items:", items);

    //Get list of the items that belong to the current identity
    let myItems: Map<number, ItemRow> = new Map();
    items.forEach((itemRow) => {
      if(showAllUserItems)
      {
        myItems.set(itemRow.id, itemRow);
      }
      else
      {
        if(conn.identity?.toHexString() === itemRow.owner.toHexString())
        {
          myItems.set(itemRow.id, itemRow);
        }
      }
    });
    
    const ItemList = React.memo(({ myItems }: { myItems: Map<number, ItemRow> }) => (
    <>
      {Array.from(myItems.values()).map((itemRow) => (
        <ItemDisplay
          key={itemRow.id}
          className="itemViewerBar_Item"
          size={80}
          itemName={itemRow.name}
          itemAmount={itemRow.quantity.toString()}
          ownerName=
          {
            //Use the itemRow.owner identity to go to database and get the user name
            conn.db.user?.identity.find(itemRow.owner)?.name || itemRow.owner.toHexString().substring(0, 8)
          }
        />
      ))}
    </>
    ));

    console.log("ItemViewerBar listOfMyItems:", myItems);
    return(
        <div className="ItemViewerBar">
            <ItemList myItems={myItems} />  
        </div>
    );
}

            //{
            //    Array.from(myItems.values()).map((itemRow, index) => (
            //        
            //        <ItemDisplay
            //            key={index}
            //            className="itemViewerBar_Item"
            //            size={80}
            //            itemName={itemRow.name}
            //            itemAmount={myItems.get(itemRow.id) ? myItems.get(itemRow.id)!.quantity.toString() : "0"}
            //        />
            //    ))
            //}


type Props = React.HTMLAttributes<HTMLDivElement> & {
  size?: number | string;           // e.g., 200 or "12rem"
  itemName?: React.ReactNode;          // optional inner label
   itemAmount?: React.ReactNode;         // optional inner amount
  ownerName?: React.ReactNode;         // optional inner owner name
};

export const ItemDisplay = forwardRef<HTMLDivElement, Props>(function ItemDisplay(
  { className, style, size = 200, itemName = "Item", itemAmount = "0", ownerName = "", children, ...rest },
  ref
) {
  const convertedSize = typeof size === "number" ? `${size}px` : size;
  return (
    <div
      ref={ref}
      className={`item-display ${className ?? ""}`.trim()}
      style={{ width: convertedSize, height: convertedSize, ...style }}
      {...rest}
    >
      {children ?? 
        (<>
            <div className="item-display__label">{itemName}</div>
            <div className="item-display__amount">{itemAmount}</div>
            <div className="item-display__ownerName">{ownerName}</div>
        </>)}
    </div>
  );
});