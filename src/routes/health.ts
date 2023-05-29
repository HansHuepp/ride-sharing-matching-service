export async function health(req: any):Promise<any>{
    return { msg:"Request was successful", status: 200, body: { status: 'UP' } };
}