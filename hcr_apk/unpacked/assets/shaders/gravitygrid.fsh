#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

const int maxFields = 4;
const float eventHorizon = 0.5;

uniform int u_numFields;
uniform float u_scale;
uniform mat2 u_rotation[maxFields];
uniform vec3 u_params[maxFields];
uniform vec2 u_origin;
uniform sampler2D u_texture;
uniform sampler2D u_texturegrid;


void main()
{
	// calculate gravity field strength and direction
	vec2 f = vec2(0.0);

	for (int i = 0; i < u_numFields; i++) {
		vec2 d = u_params[i].xy - v_texCoord;
		d.x *= 2.0;
		float r = u_scale*length(d);
		float force = u_params[i].z / (r*r);

		f += force*u_rotation[i]*normalize(d);
	}

	if (length(f) >= eventHorizon) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		vec2 gridCoord = vec2(2.0*u_scale, u_scale)*(u_origin - v_texCoord);

		vec4 col = texture2D(u_texturegrid, 20.0*f + gridCoord);
		float c = clamp(length(10.0*f), 0.0, 0.33);
		vec4 grid = c*col;
		vec4 glow = length(5.0*f)*vec4(1.0, 0.4, 0.1, 1.0);

		gl_FragColor = grid + glow + texture2D(u_texture, f + v_texCoord);
	}

}


