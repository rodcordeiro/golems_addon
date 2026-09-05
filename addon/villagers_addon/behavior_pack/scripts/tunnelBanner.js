/**
 * Tunnel start banner — shared origin for owner miners (MINER-015).
 * Pattern extracted from Soldiers placeable banners (entity_placer + marker entity).
 */

import { world, system } from "@minecraft/server";
import {
  BANNER_ENTITY_ID,
  ownerTag,
  getOwnerId,
  blockPos,
} from "./common.js";

const BIND_RADIUS = 8;
const BANNER_SEARCH = 96;

/**
 * On marker spawn, bind nearest player as owner (placer).
 */
world.afterEvents.entitySpawn.subscribe((event) => {
  const entity = event.entity;
  if (!entity?.isValid) return;
  if (entity.typeId !== BANNER_ENTITY_ID) return;

  system.run(() => {
    if (!entity.isValid) return;
    if (getOwnerId(entity)) return;

    let nearest;
    let best = Infinity;
    try {
      const players = entity.dimension.getPlayers({
        location: entity.location,
        maxDistance: BIND_RADIUS,
      });
      for (const p of players) {
        if (!p.isValid) continue;
        const dx = p.location.x - entity.location.x;
        const dy = p.location.y - entity.location.y;
        const dz = p.location.z - entity.location.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < best) {
          best = d;
          nearest = p;
        }
      }
    } catch (_) {
      return;
    }

    if (nearest?.isValid) {
      entity.addTag(ownerTag(nearest.id));
      entity.nameTag = "Inicio de Tunel";
    }
  });
});

/**
 * Nearest tunnel-start banner for this miner (same owner preferred; any ownerless fallback).
 * @param {import('@minecraft/server').Entity} miner
 * @returns {import('@minecraft/server').Entity | undefined}
 */
export function findOwnerBanner(miner) {
  if (!miner?.isValid) return undefined;
  const oid = getOwnerId(miner);
  let bestOwned;
  let bestOwnedD = Infinity;
  let bestAny;
  let bestAnyD = Infinity;

  let banners;
  try {
    banners = miner.dimension.getEntities({
      type: BANNER_ENTITY_ID,
      location: miner.location,
      maxDistance: BANNER_SEARCH,
    });
  } catch (_) {
    return undefined;
  }

  for (const b of banners) {
    if (!b.isValid) continue;
    const dx = b.location.x - miner.location.x;
    const dz = b.location.z - miner.location.z;
    const d = Math.abs(dx) + Math.abs(dz);
    const bOwner = getOwnerId(b);
    if (oid && bOwner === oid) {
      if (d < bestOwnedD) {
        bestOwnedD = d;
        bestOwned = b;
      }
    } else if (!bOwner) {
      if (d < bestAnyD) {
        bestAnyD = d;
        bestAny = b;
      }
    }
  }
  return bestOwned ?? bestAny;
}

/**
 * Shared tunnel origin: banner foot block if present, else hire point.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} hireFallback
 */
export function resolveTunnelOrigin(miner, hireFallback) {
  const banner = findOwnerBanner(miner);
  if (banner?.isValid) {
    return blockPos(banner.location);
  }
  return hireFallback;
}
