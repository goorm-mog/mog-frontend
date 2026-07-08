type PolaroidFrameProps = {
  photoCount: number;
  photoUrl?: string;
};

const POLAROID_PHOTO_PATH =
  'M203.108 26.7579L20.1106 32.1238C19.8711 32.1309 19.6822 32.3956 19.6887 32.7153L21.912 141.901C21.9185 142.221 22.1179 142.474 22.3574 142.467L205.355 137.102C205.595 137.094 205.784 136.83 205.777 136.51L203.554 27.3239C203.547 27.0043 203.348 26.7509 203.108 26.7579Z';
const PHOTO_TILT_DEGREES = -1.68;

function PolaroidFrame({ photoCount, photoUrl }: PolaroidFrameProps) {
  return (
    <div
      className="relative mx-auto w-[246px] rotate-[-1deg]"
      aria-label={`첨부 사진 ${photoCount}장`}
    >
      <svg
        className="h-auto w-full"
        viewBox="0 0 226 177"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g filter="url(#mog-card-polaroid-shadow)">
          <path
            d="M217.125 13.6161L5.61229 19.8226C5.09541 19.8377 4.687 20.3714 4.70009 21.0145L7.66991 166.967C7.68299 167.61 8.11262 168.119 8.6295 168.104L220.143 161.898C220.659 161.883 221.068 161.349 221.055 160.706L218.085 14.7531C218.072 14.11 217.642 13.6009 217.125 13.6161Z"
            fill="#FFFAF3"
            stroke="#9C9484"
            strokeWidth="1.4"
          />
          {photoUrl ? (
            <image
              href={photoUrl}
              x="16"
              y="22"
              width="194"
              height="124"
              preserveAspectRatio="xMidYMid slice"
              transform={`rotate(${PHOTO_TILT_DEGREES} 112.733 84.612)`}
              clipPath="url(#mog-card-polaroid-photo-clip)"
            />
          ) : (
            <path d={POLAROID_PHOTO_PATH} fill="url(#mog-card-polaroid-placeholder)" />
          )}
          <path
            d={POLAROID_PHOTO_PATH}
            fill="transparent"
            stroke="#1C1A14"
            strokeOpacity="0.22"
            strokeWidth="1.4"
          />
          <path
            d="M28.6221 152.994C28.0731 153.057 27.6761 153.553 27.7354 154.102C27.7947 154.651 28.2878 155.045 28.8369 154.982L28.7295 153.988L28.6221 152.994ZM205.835 150.411C206.386 150.444 206.862 150.024 206.898 149.472C206.935 148.921 206.518 148.447 205.967 148.414L205.901 149.413L205.835 150.411ZM28.7295 153.988L28.8369 154.982C65.5075 150.788 161.519 147.764 205.835 150.411L205.901 149.413L205.967 148.414C161.534 145.76 65.4061 148.787 28.6221 152.994L28.7295 153.988Z"
            fill="#1C1A14"
            fillOpacity="0.06"
          />
        </g>
        <g opacity="0.78">
          <path
            d="M64.4212 13.4915L136.596 0.588602L138.333 21.0157L66.1585 33.9186L64.4212 13.4915Z"
            fill="#E8E2D6"
          />
          <path
            d="M64.4212 13.4915L136.596 0.588602L138.333 21.0157L66.1585 33.9186L64.4212 13.4915Z"
            stroke="#9C9484"
            strokeOpacity="0.18"
          />
          <path
            d="M65.1544 17.7472L65.3235 18.7328L136.813 6.12727L136.644 5.14167L136.475 4.15607L64.9853 16.7617L65.1544 17.7472Z"
            fill="#FDF7F4"
            fillOpacity="0.24"
          />
        </g>
        <defs>
          <clipPath id="mog-card-polaroid-photo-clip">
            <path d={POLAROID_PHOTO_PATH} />
          </clipPath>
          <linearGradient
            id="mog-card-polaroid-placeholder"
            x1="29"
            y1="36"
            x2="195"
            y2="135"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E8E2D6" />
            <stop offset="0.48" stopColor="#FDF7F4" />
            <stop offset="1" stopColor="#D8CDBB" />
          </linearGradient>
          <filter
            id="mog-card-polaroid-shadow"
            x="0"
            y="12.9155"
            width="225.755"
            height="163.889"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_168_1116"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_168_1116"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
      <span className="sr-only">첨부 사진 {photoCount}장</span>
    </div>
  );
}

export default PolaroidFrame;
