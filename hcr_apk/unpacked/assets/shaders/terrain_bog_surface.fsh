#ifdef GL_ES
precision highp float;
varying highp vec2 v_texCoord;
varying highp vec2 v_pos;
#else
varying vec2 v_texCoord;
varying vec2 v_pos;
#endif

uniform sampler2D u_texture;
uniform sampler2D u_textureAlt;
uniform float u_fade;
uniform vec3 u_fadePosition;

void main()
{
	if (u_fadePosition.z > 0.0) {
		if (length(v_pos) < u_fadePosition.z) {
			discard;
			return;
		}
	}    

	vec4 a = texture2D(u_texture, v_texCoord);
	vec4 b = texture2D(u_textureAlt, v_texCoord);
	vec4 p = mix(a, b, u_fade);

	gl_FragColor = p;
}
