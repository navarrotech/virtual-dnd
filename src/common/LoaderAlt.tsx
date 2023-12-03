type Props = {
  size?: string,
  fullpage?: boolean
}

export default function LoaderAlt({ size="200px", fullpage=false }: Props) {

  const SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: 'auto', display: 'block' }} width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="18" cy="50" r="4" fill="#da3732">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"></animate>
      </circle><circle cx="27" cy="61.31370849898476" r="4" fill="#e4762f">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.125s" repeatCount="indefinite"></animate>
      </circle><circle cx="36" cy="66" r="4" fill="#f7be33">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.25s" repeatCount="indefinite"></animate>
      </circle><circle cx="45" cy="61.31370849898476" r="4" fill="#da3732">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.375s" repeatCount="indefinite"></animate>
      </circle><circle cx="54" cy="50" r="4" fill="#da3732">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.5s" repeatCount="indefinite"></animate>
      </circle><circle cx="63" cy="38.68629150101524" r="4" fill="#e4762f">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.625s" repeatCount="indefinite"></animate>
      </circle><circle cx="72" cy="34" r="4" fill="#f7be33">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.75s" repeatCount="indefinite"></animate>
      </circle><circle cx="81" cy="38.68629150101523" r="4" fill="#da3732">
        <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.875s" repeatCount="indefinite"></animate>
      </circle>
    </svg>

  )

  if(fullpage){
      return (<div className="hero is-fullheight">
          <div className="hero-body">
              { SVG }
          </div>
      </div>)
  }
  else{
      return SVG
  }
}
