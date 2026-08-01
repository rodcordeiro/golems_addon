import { world, system } from '@minecraft/server'; // ✔️ Thêm system

// Logic cho custom component 'fv:steel_hoe'
const hoeUseComponentLogic = {
    onUseOn({ source, block }) {
        if (!source) {
            return;
        }

        // Chạy animation sử dụng công cụ
        source.playAnimation("animation.humanoid.use_on_tool");
    }
};

// SỬA LỖI API: Dùng system.beforeEvents.startup thay vì world.beforeEvents.worldInitialize
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:hoe_use", hoeUseComponentLogic);
});