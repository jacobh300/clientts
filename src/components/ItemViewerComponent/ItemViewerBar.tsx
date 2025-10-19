import React, {forwardRef} from "react";
import { DbConnection, ItemRow } from "../../module_bindings";
import { useItems } from "../../lib/hooks";

export type ItemInfo = {itemName: string ,item : ItemRow | null};

//Create a dictonary for items that maps item name to itemRow
export type ItemDict = { [key: string]: ItemRow | null };

export function ItemViewerBar({ conn }: { conn: DbConnection })
{
    const items = useItems(conn);
    console.log("ItemViewerBar items:", items);

    //Get list of the items that belong to the current identity
    let myItems: Map<string, ItemRow> = new Map();
    items.forEach((itemRow) => {
        if(itemRow.owner.toHexString() == conn.identity?.toHexString())
        {
            myItems.set(itemRow.name, itemRow);
        }
    });


    console.log("ItemViewerBar listOfMyItems:", myItems);
    return(
        <div className="ItemViewerBar">
            <ItemDisplay
                className="itemViewerBar_Item"
                size={50}
                itemName="coin"
                itemAmount={myItems.get("coin") ? myItems.get("coin")!.quantity.toString() : "0"}
            />
        </div>
    );
}




//Create a 200px x 200px box with a border and a background color of light gray
//Inside the box, place a button labeled "Item"
//Should not be a button just a div with styling
type Props = React.HTMLAttributes<HTMLDivElement> & {
  size?: number | string;           // e.g., 200 or "12rem"
  itemName?: React.ReactNode;          // optional inner label
   itemAmount?: React.ReactNode;         // optional inner amount
};

export const ItemDisplay = forwardRef<HTMLDivElement, Props>(function ItemDisplay(
  { className, style, size = 200, itemName = "Item", itemAmount = "0", children, ...rest },
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
        </>)}
    </div>
  );
});