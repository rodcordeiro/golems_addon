import { system, ItemStack, ItemTypes } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, sourceEntity } = event;

    if (id !== "fv:refine_inventory") return;
    if (!sourceEntity) return;

    const inventory = sourceEntity.getComponent("minecraft:inventory");
    if (!inventory) return;

    const container = inventory.container;

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;

        const typeId = item.typeId;
        const amount = item.amount;

        // Xử lý chuyển đổi từng loại
        switch (typeId) {
            case "fv:raw_iron_nugget":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:iron_nugget"), amount));
                break;
            case "fv:raw_copper_nugget":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:copper_nugget"), amount));
                break;
            case "fv:raw_gold_nugget":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:gold_nugget"), amount));
                break;
            case "minecraft:raw_iron":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:iron_ingot"), amount));
                break;
            case "minecraft:raw_copper":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:copper_ingot"), amount));
                break;
            case "minecraft:raw_gold":
                container.setItem(i, new ItemStack(ItemTypes.get("minecraft:gold_ingot"), amount));
                break;
            case "minecraft:coal":
            case "minecraft:charcoal":
                container.setItem(i, undefined); // Xóa món đó luôn
                break;
            default:
                // Các món khác giữ nguyên
                break;
        }
    }
}, { namespaces: ["fv"] });
