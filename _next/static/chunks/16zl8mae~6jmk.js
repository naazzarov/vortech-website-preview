(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67371,e=>{"use strict";let t,i;var n=e.i(43476),r=e.i(75056),a=e.i(25234);function s(){return(s=Object.assign.bind()).apply(null,arguments)}var o=e.i(71645),l=e.i(90072),d=e.i(1950),d=d,f=l,c=l;let u=new c.Box3,p=new c.Vector3;class h extends c.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new c.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new c.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new c.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new c.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new c.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new c.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new c.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new c.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new c.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),u.setFromBufferAttribute(t),this.boundingBox.union(u))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new c.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)p.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(p)),p.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(p));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var m=l,v=e.i(8560);let y=parseInt(l.REVISION.replace(/\D+/g,""));class g extends m.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:m.UniformsUtils.clone(m.UniformsUtils.merge([v.UniformsLib.common,v.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new m.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${y>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let S=y>=125?"uv1":"uv2",x=new f.Vector4,w=new f.Vector3,b=new f.Vector3,E=new f.Vector4,_=new f.Vector4,A=new f.Vector4,L=new f.Vector3,U=new f.Matrix4,M=new f.Line3,z=new f.Vector3,B=new f.Box3,C=new f.Sphere,O=new f.Vector4;function P(e,t,n){return O.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),O.multiplyScalar(1/O.w),O.x=i/n.width,O.y=i/n.height,O.applyMatrix4(e.projectionMatrixInverse),O.multiplyScalar(1/O.w),Math.abs(Math.max(O.x,O.y))}class j extends f.Mesh{constructor(e=new h,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)w.fromBufferAttribute(t,e),b.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+w.distanceTo(b);let r=new f.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new f.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new f.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,a,s=this.material.worldUnits,o=e.camera;null!==o||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,c=this.geometry,u=this.material;if(i=u.linewidth+l,null===c.boundingSphere&&c.computeBoundingSphere(),C.copy(c.boundingSphere).applyMatrix4(d),s)r=.5*i;else{let e=Math.max(o.near,C.distanceToPoint(t.origin));r=P(o,e,u.resolution)}if(C.radius+=r,!1!==t.intersectsSphere(C)){if(null===c.boundingBox&&c.computeBoundingBox(),B.copy(c.boundingBox).applyMatrix4(d),s)a=.5*i;else{let e=Math.max(o.near,B.distanceToPoint(t.origin));a=P(o,e,u.resolution)}B.expandByScalar(a),!1!==t.intersectsBox(B)&&(s?function(e,n){let r=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,o=a.attributes.instanceEnd,l=Math.min(a.instanceCount,s.count);for(let a=0;a<l;a++){M.start.fromBufferAttribute(s,a),M.end.fromBufferAttribute(o,a),M.applyMatrix4(r);let l=new f.Vector3,d=new f.Vector3;t.distanceSqToSegment(M.start,M.end,d,l),d.distanceTo(l)<.5*i&&n.push({point:d,pointOnLine:l,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:a,uv:null,[S]:null})}}(this,n):function(e,n,r){let a=n.projectionMatrix,s=e.material.resolution,o=e.matrixWorld,l=e.geometry,d=l.attributes.instanceStart,c=l.attributes.instanceEnd,u=Math.min(l.instanceCount,d.count),p=-n.near;t.at(1,A),A.w=1,A.applyMatrix4(n.matrixWorldInverse),A.applyMatrix4(a),A.multiplyScalar(1/A.w),A.x*=s.x/2,A.y*=s.y/2,A.z=0,L.copy(A),U.multiplyMatrices(n.matrixWorldInverse,o);for(let n=0;n<u;n++){if(E.fromBufferAttribute(d,n),_.fromBufferAttribute(c,n),E.w=1,_.w=1,E.applyMatrix4(U),_.applyMatrix4(U),E.z>p&&_.z>p)continue;if(E.z>p){let e=E.z-_.z,t=(E.z-p)/e;E.lerp(_,t)}else if(_.z>p){let e=_.z-E.z,t=(_.z-p)/e;_.lerp(E,t)}E.applyMatrix4(a),_.applyMatrix4(a),E.multiplyScalar(1/E.w),_.multiplyScalar(1/_.w),E.x*=s.x/2,E.y*=s.y/2,_.x*=s.x/2,_.y*=s.y/2,M.start.copy(E),M.start.z=0,M.end.copy(_),M.end.z=0;let l=M.closestPointToPointParameter(L,!0);M.at(l,z);let u=f.MathUtils.lerp(E.z,_.z,l),h=u>=-1&&u<=1,m=L.distanceTo(z)<.5*i;if(h&&m){M.start.fromBufferAttribute(d,n),M.end.fromBufferAttribute(c,n),M.start.applyMatrix4(o),M.end.applyMatrix4(o);let i=new f.Vector3,a=new f.Vector3;t.distanceSqToSegment(M.start,M.end,a,i),r.push({point:a,pointOnLine:i,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:n,uv:null,[S]:null})}}}(this,o,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}}class D extends h{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class I extends j{constructor(e=new D,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let T=o.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:n,lineWidth:r,segments:a,dashed:f,...c},u){var p,m;let v=(0,d.C)(e=>e.size),y=o.useMemo(()=>a?new j:new I,[a]),[S]=o.useState(()=>new g),x=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,w=o.useMemo(()=>{let n=a?new h:new D,r=e.map(e=>{let t=Array.isArray(e);return e instanceof l.Vector3||e instanceof l.Vector4?[e.x,e.y,e.z]:e instanceof l.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof l.Color?e.toArray():e);n.setColors(e.flat(),x)}return n},[e,a,i,x]);return o.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),o.useLayoutEffect(()=>{f?S.defines.USE_DASH="":delete S.defines.USE_DASH,S.needsUpdate=!0},[f,S]),o.useEffect(()=>()=>{w.dispose(),S.dispose()},[w]),o.createElement("primitive",s({object:y,ref:u},c),o.createElement("primitive",{object:w,attach:"geometry"}),o.createElement("primitive",s({object:S,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(m=null!=n?n:r)?m:1,dashed:f,transparent:4===x},c)))});var R=e.i(94735);let V=(e,t,i)=>{let n=Math.PI/180*(90-e),r=Math.PI/180*(t+180);return new l.Vector3(-i*Math.sin(n)*Math.cos(r),i*Math.cos(n),i*Math.sin(n)*Math.sin(r))},H=()=>{let e=(0,o.useRef)(null),t=(0,o.useMemo)(()=>V(R.marketPresence.hqCoords.lat,R.marketPresence.hqCoords.lon,2),[]),i=(0,o.useMemo)(()=>R.marketPresence.destinations.map(e=>{let i=V(e.lat,e.lon,2);return{name:e.name,vec:i,points:((e,t,i=48)=>{let n=e.clone().add(t).multiplyScalar(.5),r=.45*e.distanceTo(t)+.25;return n.normalize().multiplyScalar(2+r),new l.QuadraticBezierCurve3(e,n,t).getPoints(i)})(t,i)}}),[t]);return(0,a.useFrame)((t,i)=>{e.current&&(e.current.rotation.y+=.08*i)}),(0,n.jsxs)("group",{ref:e,rotation:[.15,0,0],children:[(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[2,48,48]}),(0,n.jsx)("meshBasicMaterial",{color:"#0e3792",transparent:!0,opacity:.14})]}),(0,n.jsxs)("mesh",{children:[(0,n.jsx)("icosahedronGeometry",{args:[2,3]}),(0,n.jsx)("meshBasicMaterial",{color:"#2fa0fa",wireframe:!0,transparent:!0,opacity:.22})]}),i.map(e=>(0,n.jsx)(T,{points:e.points,color:"#6cc2ff",lineWidth:1.2,transparent:!0,opacity:.75},e.name)),i.map(e=>(0,n.jsxs)("mesh",{position:e.vec,children:[(0,n.jsx)("sphereGeometry",{args:[.032,12,12]}),(0,n.jsx)("meshBasicMaterial",{color:"#ffffff"})]},`${e.name}-dot`)),(0,n.jsxs)("mesh",{position:t,children:[(0,n.jsx)("sphereGeometry",{args:[.06,16,16]}),(0,n.jsx)("meshBasicMaterial",{color:"#2fa0fa"})]}),(0,n.jsxs)("mesh",{position:t,children:[(0,n.jsx)("sphereGeometry",{args:[.11,16,16]}),(0,n.jsx)("meshBasicMaterial",{color:"#2fa0fa",transparent:!0,opacity:.25})]})]})};e.s(["MarketPresenceGlobeCanvas",0,()=>(0,n.jsx)(r.Canvas,{dpr:[1,1.75],gl:{antialias:!0,alpha:!0,powerPreference:"low-power"},camera:{position:[0,.6,5.4],fov:42},"aria-hidden":"true",children:(0,n.jsx)(H,{})})],67371)},88995,e=>{e.n(e.i(67371))}]);