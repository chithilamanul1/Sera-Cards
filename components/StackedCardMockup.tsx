'use client';

import React from 'react';
import { CardProduct } from '@/data/products';
import { QrMock } from './QrMock';

interface StackedCardMockupProps {
  product: CardProduct;
}

export function StackedCardMockup({ product }: StackedCardMockupProps) {
  const design = product.cardDesign;
  const isWhite = product.id === 'classic-white' || product.materialId === 'epic_white';
  const isCompany = product.id === 'company-card';
  const isCustom = product.id === 'custom-card';
  const isGold = product.id.includes('gold') || product.materialId === 'gold';
  const isSilver = product.id.includes('silver') || product.materialId === 'metal_silver';
  const isGloss = product.id.includes('gloss');

  // Front typography
  const previewName = design.previewName || 'CHITHILA MANUL';
  const previewTitle = design.previewTitle || 'SMART BUSINESS CARD';

  return (
    <div className="relative h-56 sm:h-64 w-full flex items-center justify-center select-none overflow-hidden py-4">
      {/* 3D Scene Container */}
      <div
        className="relative w-52 sm:w-60 aspect-[1.586/1] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Realistic Floor Shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-10 rounded-full bg-black/80 blur-xl transition-opacity duration-300 group-hover:opacity-60"
        />

        {/* ─── 1. BOTTOM CARD (Back face with QR Code) ─── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden border transition-transform duration-500 ease-out"
          style={{
            backgroundColor: design.backgroundColor,
            backgroundImage: design.backgroundImage,
            borderColor: design.edgeBorder,
            color: design.textColor,
            transform: 'rotateX(54deg) rotateZ(-32deg) rotateY(4deg) translateZ(-16px) translateX(-24px) translateY(42px)',
            boxShadow: '0 25px 35px -10px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Surface Sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent"
          />

          <div className="relative h-full w-full p-3 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between text-[7px] font-mono tracking-widest opacity-60 uppercase">
              <span>NXP NTAG215</span>
              {/* Wave */}
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                <path d="M15.5 21.5a12 12 0 0 1 0-19" />
              </svg>
            </div>

            {/* Bottom row: QR Code + Credentials */}
            <div className="flex items-end justify-between gap-2">
              {/* Dynamic QR Mock */}
              <div className="bg-white p-1 rounded shadow-md shrink-0">
                <QrMock color="#090a0f" background="#ffffff" className="h-10 w-10" />
              </div>

              <div className="text-right text-[7px] font-mono leading-tight opacity-75 truncate">
                <p className="font-bold tracking-wider">SERANEX.LK</p>
                <p className="opacity-70 text-[6px]">TAP OR SCAN</p>
                <p className="text-purple-400 font-semibold mt-0.5">0.2s RESPONSE</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. TOP CARD (Front Face Elevated) ─── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden border transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:translate-x-1"
          style={{
            backgroundColor: design.backgroundColor,
            backgroundImage: design.backgroundImage,
            borderColor: design.edgeBorder,
            color: design.textColor,
            transform: 'rotateX(54deg) rotateZ(-32deg) rotateY(4deg) translateZ(18px) translateX(8px) translateY(-8px)',
            boxShadow: '0 28px 50px -12px rgba(0,0,0,0.95), 0 10px 20px -5px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        >
          {/* Metallic / Specular Glare */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${
              isGold
                ? 'bg-gradient-to-tr from-amber-500/20 via-white/50 to-amber-600/30'
                : isSilver
                ? 'bg-gradient-to-tr from-slate-400/10 via-white/30 to-slate-500/20'
                : isGloss
                ? 'bg-gradient-to-tr from-white/10 via-white/35 to-transparent'
                : 'bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent'
            }`}
          />

          <div className="relative h-full w-full p-3.5 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between text-[7px] font-mono tracking-widest opacity-60 uppercase">
              <span className="font-semibold">SERA</span>
              {/* Contactless Wave */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                <path d="M15.5 21.5a12 12 0 0 1 0-19" />
              </svg>
            </div>

            {/* Center Content based on card style */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
              {isGold ? (
                /* Bespoke 24K Gold Card */
                <div className="space-y-1">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded border border-amber-900/20 bg-amber-900/10 shadow-inner">
                    <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-950">
                      24K GOLD
                    </span>
                  </div>
                  <span className="text-[7px] uppercase tracking-[0.2em] block text-amber-900 font-extrabold">
                    CUSTOM BESPOKE EDITION
                  </span>
                </div>
              ) : isCompany ? (
                /* Corporate Logo Card */
                <div className="space-y-1">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded border border-white/20 bg-white/5">
                    <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
                      LOGO
                    </span>
                  </div>
                  <span className="text-[7px] uppercase tracking-[0.2em] block opacity-70">
                    COMPANY EDITION
                  </span>
                </div>
              ) : isCustom ? (
                /* Custom Design Badge Card */
                <div className="space-y-1">
                  <div className="relative inline-block px-3 py-1.5 rounded-lg border border-purple-400/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-sm">
                    <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-white block">
                      YOUR DESIGN HERE
                    </span>
                  </div>
                  <span className="text-[7px] uppercase tracking-widest block text-purple-300 font-medium">
                    100% CUSTOM ARTWORK
                  </span>
                </div>
              ) : (
                /* Classic Name + Designation Card */
                <div className="space-y-0.5">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold tracking-tight uppercase block leading-tight ${
                      isWhite ? 'text-zinc-900 font-extrabold' : 'text-white'
                    }`}
                  >
                    {previewName}
                  </span>
                  <span
                    className={`text-[7px] uppercase tracking-wider block ${
                      isWhite ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    {previewTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between text-[6px] font-mono tracking-widest opacity-60 uppercase">
              <span>{isWhite ? 'MATTE PVC' : product.surfaceType}</span>
              <span>SERANEX.LK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
