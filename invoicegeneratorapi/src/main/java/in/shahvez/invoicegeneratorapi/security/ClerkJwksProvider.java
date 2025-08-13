package in.shahvez.invoicegeneratorapi.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class ClerkJwksProvider {
     @Value("${clerk.jwks-url}")
    private String jwksUrl;

     private final Map<String, PublicKey> keyCache = new HashMap<>();
     private long lastfetchTime;
     private static final long CACHE_TTL = 3600000;

     public PublicKey getPublicKey(String kid) throws Exception {
         if(keyCache.containsKey(kid) && System.currentTimeMillis()- lastfetchTime < CACHE_TTL){
             return keyCache.get(kid);

         }
         refreshkeys();
         return keyCache.get(kid);

     }

    private void refreshkeys()  throws Exception{
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwsk = mapper.readTree(new URL(jwksUrl));

        JsonNode keys = jwsk.get("keys");
        for (JsonNode keyNode:  keys){
            String kid = keyNode.get("kid").asText();
            String kty = keyNode.get("kty").asText();
            String alg = keyNode.get("alg").asText();

            if ("RSA".equals(kty )&& "RS256".equals(alg)) {
                String n = keyNode.get("n").asText();
                String e = keyNode.get("e").asText();

                PublicKey publicKey = createPublickEY(n,e);
                keyCache.put(kid, publicKey);


            }
        }
        lastfetchTime = System.currentTimeMillis();

    }

    private PublicKey createPublickEY(String moduls, String exponent) throws Exception {
          byte[] modulusBytes = Base64.getUrlDecoder().decode(moduls);
          byte[] exponentBytes =Base64.getUrlDecoder().decode(exponent);

        BigInteger modulsBigInt = new BigInteger(1,modulusBytes);
        BigInteger exponentBigInt = new BigInteger(1,exponentBytes);

      RSAPublicKeySpec spec =   new RSAPublicKeySpec(modulsBigInt,exponentBigInt);
        KeyFactory factory = KeyFactory.getInstance("RSA");

        return factory.generatePublic(spec);



    }
}
